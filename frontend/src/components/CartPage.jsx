import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { siteService } from '../services/api';

function CartPage() {
  const [cart, setCart] = useState({ items: [] });
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await siteService.get('/cart');
      setCart(response.data);
    } catch (error) {
      console.error('Erro ao buscar carrinho:', error);
    }
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
    try {
      await siteService.put(`/cart/item/${itemId}`, { quantity });
      fetchCart();
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await siteService.delete(`/cart/item/${itemId}`);
      fetchCart();
    } catch (error) {
      console.error('Erro ao remover item:', error);
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await siteService.post('/cart/checkout', { shipping_address: shippingAddress, payment_method: paymentMethod });
      alert(`Pedido criado com sucesso! ID: ${response.data.orderId}`);
      navigate('/');
    } catch (error) {
      console.error('Erro ao finalizar compra:', error);
    }
  };

  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto p-4">
      <Button variant="ghost" onClick={() => navigate('/')} className="mb-4"><ArrowLeft className="mr-2" /> Voltar</Button>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><ShoppingCart className="mr-2" /> Meu Carrinho</CardTitle>
        </CardHeader>
        <CardContent>
          {cart.items.length === 0 ? (
            <p className="text-center text-gray-500">Seu carrinho está vazio</p>
          ) : (
            <>
              {cart.items.map(item => (
                <div key={item.id} className="flex items-center justify-between border-b py-4">
                  <div className="flex items-center">
                    <img src={item.images[0]} alt={item.name} className="w-16 h-16 object-cover mr-4" />
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">R$ {item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Input type="number" value={item.quantity} onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value))} className="w-20 mr-2" />
                    <Button variant="ghost" onClick={() => handleRemoveItem(item.id)}><Trash2 /></Button>
                  </div>
                </div>
              ))}
              <div className="mt-6">
                <h3 className="text-xl font-bold">Total: R$ {total.toFixed(2)}</h3>
              </div>
              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="shipping">Endereço de Entrega</Label>
                  <Input id="shipping" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="payment">Método de Pagamento</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                      <SelectItem value="boleto">Boleto</SelectItem>
                      <SelectItem value="pix">PIX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCheckout} className="w-full">Finalizar Compra</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CartPage;