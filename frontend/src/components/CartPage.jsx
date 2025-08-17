import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Trash2, ShoppingCart, ArrowLeft, CreditCard, QrCode } from 'lucide-react';
import api, { paymentService } from '../services/api';
import { loadMercadoPago } from '../utils/mercadopago';
import { Alert, AlertDescription } from './ui/alert';

function CartPage() {
  const [cart, setCart] = useState({ items: [] });
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [addressData, setAddressData] = useState({
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart');
      setCart(response.data);
    } catch (error) {
      console.error('Erro ao buscar carrinho:', error);
    }
  };

  const handleAddressChange = (field, value) => {
    setAddressData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    try {
      await api.put(`/cart/item/${itemId}`, { quantity });
      fetchCart();
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await api.delete(`/cart/item/${itemId}`);
      fetchCart();
    } catch (error) {
      console.error('Erro ao remover item:', error);
    }
  };

  const subtotal = cart.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const total = subtotal;

  const handleCheckout = async () => {
    if (!addressData.cep || !addressData.street) {
      setPaymentError('Por favor, preencha o CEP e endereço');
      return;
    }

    setIsProcessingPayment(true);
    setPaymentError('');

    try {
      // Criar pedido com endereço formatado
      const orderResponse = await api.post('/cart/checkout', {
        payment_method: paymentMethod,
        address_data: addressData
      });

      // Iniciar pagamento com dados do endereço
      const paymentResponse = await paymentService.createPayment({
        orderId: orderResponse.data.orderId,
        paymentMethod,
        total,
        address: addressData
      });

      if (paymentMethod === 'pix') {
        // Redirecionar para página de pagamento PIX
        window.location.href = paymentResponse.data.init_point;
      } else {
        // Carregar SDK do Mercado Pago para cartão
        const mp = await loadMercadoPago();
        const cardPaymentBrickController = await mp.bricks().create('payment', 'payment-container', {
          initialization: {
            amount: total
          },
          customization: {
            paymentMethods: {
              creditCard: 'all',
              debitCard: 'all'
            }
          },
          callbacks: {
            onReady: () => {
              console.log('Brick de pagamento pronto');
            },
            onSubmit: async (cardFormData) => {
              try {
                console.log('Dados do formulário do cartão:', cardFormData);
                const response = await paymentService.processCardPayment({
                  orderId: orderResponse.data.orderId,
                  cardData: cardFormData
                });

                if (response.data.status === 'approved') {
                  // Preparar mensagem para WhatsApp
                  const items = cart.items.map(item => {
                    const options = item.options ? Object.entries(item.options).map(([key, value]) => `${key}: ${value}`).join(', ') : '';
                    return `${item.name} (${item.quantity}x) - R$ ${Number(item.price * item.quantity).toFixed(2)}${options ? ` (${options})` : ''}`;
                  }).join('\n');

                  const message = `*Novo Pedido*\n\n${items}\n\n*Total: R$ ${Number(total).toFixed(2)}*\n\n*Endereço de Entrega:*\n${addressData.street}, ${addressData.number}${addressData.complement ? `, ${addressData.complement}` : ''}\n${addressData.neighborhood}\n${addressData.city} - ${addressData.state}\nCEP: ${addressData.cep}`;
                  
                  const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank');
                  navigate('/payment/success');
                } else {
                  navigate('/payment/failure');
                }
              } catch (error) {
                console.error('Erro ao processar pagamento:', error);
                setPaymentError('Erro ao processar pagamento. Por favor, tente novamente.');
              }
            },
            onError: (error) => {
              console.error('Erro no Brick:', error);
              setPaymentError('Erro ao carregar formulário de pagamento. Por favor, tente novamente.');
            }
          }
        });
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      setPaymentError('Erro ao processar pagamento. Por favor, tente novamente.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
        <ArrowLeft className="mr-2" /> Voltar
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2" /> Meu Carrinho
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.items.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Seu carrinho está vazio</p>
                  <Button onClick={() => navigate('/products')}>
                    Continuar Comprando
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between border-b py-4">
                      <div className="flex items-center">
                        <img
                          src={item.main_image || (item.images && item.images[0])}
                          alt={item.name}
                          className="w-16 h-16 object-cover mr-4 rounded"
                        />
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-gray-600">R$ {Number(item.price).toFixed(2)}</p>
                          {item.options && (
                            <p className="text-sm text-gray-500">
                              {Object.entries(item.options).map(([key, value]) => (
                                `${key}: ${value}`
                              )).join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value))}
                            className="w-16 text-center"
                            min="1"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {cart.items.length > 0 && (
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>R$ {Number(subtotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>R$ {Number(total).toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>CEP</Label>
                      <Input
                        value={addressData.cep}
                        onChange={(e) => handleAddressChange('cep', e.target.value)}
                        placeholder="00000-000"
                      />
                    </div>
                    <div>
                      <Label>Número</Label>
                      <Input
                        value={addressData.number}
                        onChange={(e) => handleAddressChange('number', e.target.value)}
                        placeholder="123"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Endereço</Label>
                    <Input
                      value={addressData.street}
                      onChange={(e) => handleAddressChange('street', e.target.value)}
                      placeholder="Rua, Avenida..."
                    />
                  </div>

                  <div>
                    <Label>Complemento</Label>
                    <Input
                      value={addressData.complement}
                      onChange={(e) => handleAddressChange('complement', e.target.value)}
                      placeholder="Apto, Sala..."
                    />
                  </div>

                  <div>
                    <Label>Bairro</Label>
                    <Input
                      value={addressData.neighborhood}
                      onChange={(e) => handleAddressChange('neighborhood', e.target.value)}
                      placeholder="Seu bairro"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Cidade</Label>
                      <Input
                        value={addressData.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                        placeholder="Sua cidade"
                      />
                    </div>
                    <div>
                      <Label>Estado</Label>
                      <Input
                        value={addressData.state}
                        onChange={(e) => handleAddressChange('state', e.target.value)}
                        placeholder="UF"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Método de Pagamento</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        type="button"
                        variant={paymentMethod === 'credit_card' ? 'default' : 'outline'}
                        onClick={() => setPaymentMethod('credit_card')}
                        className="flex items-center justify-center"
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Cartão de Crédito
                      </Button>
                      <Button
                        type="button"
                        variant={paymentMethod === 'pix' ? 'default' : 'outline'}
                        onClick={() => setPaymentMethod('pix')}
                        className="flex items-center justify-center"
                      >
                        <QrCode className="mr-2 h-4 w-4" />
                        PIX
                      </Button>
                    </div>
                  </div>

                  {paymentError && (
                    <Alert variant="destructive">
                      <AlertDescription>{paymentError}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    className="w-full"
                    onClick={handleCheckout}
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment ? 'Processando...' : 'Finalizar Compra'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Container para o formulário de cartão de crédito do Mercado Pago */}
      <div id="payment-container"></div>
    </div>
  );
}

export default CartPage;