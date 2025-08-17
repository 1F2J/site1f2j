import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, User, MapPin, Bell, Shield, Trash2, Plus, Check, Edit, Loader2 } from 'lucide-react';
import { userService } from '../services/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { toast, Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const addressSchema = z.object({
  type: z.enum(['shipping', 'billing'], {
    required_error: 'Selecione o tipo de endereço'
  }),
  street: z.string().min(3, 'Rua deve ter no mínimo 3 caracteres').max(255, 'Rua deve ter no máximo 255 caracteres'),
  number: z.string().min(1, 'Número é obrigatório').max(20, 'Número deve ter no máximo 20 caracteres'),
  complement: z.string().max(255, 'Complemento deve ter no máximo 255 caracteres').optional().or(z.literal('')), // Permite string vazia
  neighborhood: z.string().min(2, 'Bairro deve ter no mínimo 2 caracteres').max(255, 'Bairro deve ter no máximo 255 caracteres'),
  city: z.string().min(2, 'Cidade deve ter no mínimo 2 caracteres').max(255, 'Cidade deve ter no máximo 255 caracteres'),
  state: z.string().length(2, 'Estado deve ter 2 caracteres'),
  postal_code: z.string().length(8, 'CEP deve ter exatamente 8 dígitos').regex(/^\d+$/, 'CEP deve conter apenas números'),
  is_default: z.boolean().default(false),
  recipient_name: z.string().min(3, 'Nome do destinatário deve ter no mínimo 3 caracteres').max(255, 'Nome do destinatário deve ter no máximo 255 caracteres')
});

const profileSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  date_of_birth: z.string().refine((date) => {
    const today = new Date();
    const birthDate = new Date(date);
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 18;
  }, 'Você deve ter pelo menos 18 anos')
});

// Hook para lidar com a busca de CEP
function useCepHandler(addressForm, setIsLoadingCep) {
  const handleCepChange = useCallback(async (value, field) => {
    const cleanedValue = value.replace(/\D/g, ''); // Remove caracteres não numéricos
    field.onChange(cleanedValue); // Atualiza o campo com o valor limpo

    if (cleanedValue.length === 8) {
      setIsLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanedValue}/json/`);
        const data = await response.json();

        if (!data.erro) {
          addressForm.setValue('street', data.logradouro);
          addressForm.setValue('neighborhood', data.bairro);
          addressForm.setValue('city', data.localidade);
          addressForm.setValue('state', data.uf);
          toast.success('CEP encontrado!');
        } else {
          toast.error('CEP não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        toast.error('Erro ao buscar CEP');
      } finally {
        setIsLoadingCep(false);
      }
    }
  }, [addressForm, setIsLoadingCep]);

  return handleCepChange;
}

function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [consents, setConsents] = useState({
    marketing: false,
    data_usage: false
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      date_of_birth: ''
    }
  });

  const addressForm = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      type: 'shipping',
      recipient_name: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      postal_code: '',
      is_default: false
    }
  });

  // Utiliza o hook useCepHandler
  const handleCepChange = useCepHandler(addressForm, setIsLoadingCep);

  useEffect(() => {
    fetchUserData();
    fetchAddresses();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await userService.getProfile();
      setUser(response.data);
      form.reset(response.data); // Preenche o formulário de perfil com os dados do usuário
      setConsents({
        marketing: response.data.marketing_consent,
        data_usage: response.data.data_usage_consent
      });
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      toast.error('Erro ao carregar dados do perfil', { description: 'Tente recarregar a página.' });
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await userService.getAddresses();
      setAddresses(response.data);
    } catch (error) {
      console.error('Erro ao buscar endereços:', error);
      toast.error('Erro ao carregar endereços', { description: 'Tente recarregar a página.' });
    }
  };

  const handleUpdateProfile = async (values) => {
    setIsSubmitting(true);
    try {
      await userService.updateProfile(values);
      toast.success('Perfil atualizado com sucesso!', {
        description: 'Suas informações foram atualizadas.',
        icon: <Check className="h-4 w-4" />
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Erro ao atualizar perfil', {
        description: error.response?.data?.message || 'Tente novamente mais tarde.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAddress = async (values) => {
    setIsSubmittingAddress(true);
    try {
      // Prepara os dados do endereço conforme o schema do banco
      const addressData = {
        type: values.type,
        recipient_name: values.recipient_name || user.name,
        street: values.street.trim(),
        number: values.number.trim(),
        complement: (values.complement || '').trim(),
        neighborhood: values.neighborhood.trim(),
        city: values.city.trim(),
        state: values.state.toUpperCase(),
        zip_code: values.postal_code.replace(/\D/g, ''), // Remove caracteres não numéricos
        is_default: values.is_default || false
      };
      await userService.addAddress(addressData);
      toast.success('Endereço adicionado com sucesso!', {
        description: 'O novo endereço foi cadastrado.',
        icon: <Check className="h-4 w-4" />
      });
      setIsAddingAddress(false);
      addressForm.reset();
      fetchAddresses();
    } catch (error) {
      console.error('Erro ao adicionar endereço:', error);
      toast.error('Erro ao adicionar endereço', {
        description: error.response?.data?.message || 'Tente novamente mais tarde.'
      });
    } finally {
      setIsSubmittingAddress(false);
    }
  };

  const handleEditAddress = async (addressId) => {
    try {
      const address = addresses.find(addr => addr.id === addressId);
      if (!address) {
        toast.error('Endereço não encontrado para edição.');
        return;
      }

      // Converter zip_code para postal_code para o formulário e preencher
      addressForm.reset({
        ...address,
        postal_code: address.zip_code,
        // Garante que o tipo esteja correto, pois o backend pode retornar 'shipping' ou 'billing'
        type: address.type || 'shipping'
      });
      setIsAddingAddress(true); // Abre o formulário para edição
    } catch (error) {
      console.error('Erro ao editar endereço:', error);
      toast.error('Erro ao editar endereço', {
        description: 'Tente novamente mais tarde.'
      });
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      await userService.setDefaultAddress(addressId);
      toast.success('Endereço padrão atualizado!', {
        description: 'O endereço foi definido como padrão.',
        icon: <Check className="h-4 w-4" />
      });
      fetchAddresses();
    } catch (error) {
      console.error('Erro ao definir endereço padrão:', error);
      toast.error('Erro ao definir endereço padrão', {
        description: error.response?.data?.message || 'Tente novamente mais tarde.'
      });
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await userService.deleteAddress(addressId);
      toast.success('Endereço removido com sucesso!', {
        description: 'O endereço foi excluído.',
        icon: <Trash2 className="h-4 w-4" />
      });
      fetchAddresses();
    } catch (error) {
      console.error('Erro ao deletar endereço:', error);
      toast.error('Erro ao deletar endereço', {
        description: error.response?.data?.message || 'Tente novamente mais tarde.'
      });
    }
  };

  const handleConsentUpdate = async (type, checked) => {
    const newConsents = { ...consents, [type]: checked };
    try {
      await userService.updateConsents(newConsents);
      setConsents(newConsents);
      toast.success('Preferências atualizadas', {
        description: `Suas preferências de ${type === 'marketing' ? 'comunicação' : 'uso de dados'} foram atualizadas.`,
        icon: <Check className="h-4 w-4" />
      });
    } catch (error) {
      console.error('Erro ao atualizar preferências:', error);
      toast.error('Erro ao atualizar preferências', {
        description: 'Não foi possível salvar suas preferências. Tente novamente mais tarde.'
      });
      // Reverter a mudança no estado local em caso de erro
      setConsents((prev) => ({ ...prev, [type]: !checked }));
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      await userService.requestAccountDeletion();
      toast.success('Solicitação de exclusão enviada', {
        description: 'Sua conta será excluída em breve.',
      });
      setTimeout(() => {
        navigate('/logout');
      }, 2000);
    } catch (error) {
      console.error('Erro ao solicitar exclusão da conta:', error);
      toast.error('Erro ao solicitar exclusão', {
        description: 'Não foi possível processar sua solicitação. Tente novamente mais tarde.',
      });
    } finally {
      setIsDeletingAccount(false);
    }
  };

  if (!user) return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /> Carregando...</div>;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Toaster richColors closeButton position="top-right" />
      <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
        <ArrowLeft className="mr-2" /> Voltar
      </Button>

      {/* Dados Pessoais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2" /> Dados Pessoais
          </CardTitle>
          <CardDescription>
            Mantenha seus dados pessoais atualizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateProfile)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="(00) 00000-0000"
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 11) {
                            field.onChange(value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3'));
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Nascimento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      Você deve ter pelo menos 18 anos para se cadastrar
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Endereços */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2" /> Meus Endereços
          </CardTitle>
          <CardDescription>
            Gerencie seus endereços de entrega e cobrança
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="wait">
              {addresses.map(address => (
                <motion.div
                  key={address.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-card border rounded-xl p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">
                          {address.type === 'shipping' ? 'Endereço de Entrega' : 'Endereço de Cobrança'}
                        </p>
                        {address.is_default && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Check className="w-3 h-3 mr-1" /> Padrão
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-muted-foreground">
                    <p className="font-medium text-foreground">{address.street}, {address.number}</p>
                    {address.complement && <p>{address.complement}</p>}
                    <p>{address.neighborhood}</p>
                    <p>{address.city} - {address.state}</p>
                    <p className="font-mono">{address.zip_code?.replace(/^(\d{5})(\d{3})$/, '$1-$2')}</p>
                  </div>
                  <div className="flex items-center space-x-2 mt-4 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEditAddress(address.id)}
                    >
                      <Edit className="h-4 w-4 mr-2" /> Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Remover
                    </Button>
                    {!address.is_default && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleSetDefaultAddress(address.id)}
                      >
                        <Check className="h-4 w-4 mr-2" /> Definir como Padrão
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {!isAddingAddress && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  onClick={() => {
                    setIsAddingAddress(true);
                    addressForm.reset(); // Limpa o formulário ao adicionar novo
                  }}
                  className="w-full h-[200px] flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl hover:border-primary hover:bg-primary/5 transition-colors"
                  variant="ghost"
                >
                  <Plus className="h-8 w-8" />
                  <span>Adicionar Novo Endereço</span>
                </Button>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {isAddingAddress && (
                <motion.div
                  key="add-address-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="col-span-2"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Novo Endereço</CardTitle>
                      <CardDescription>Preencha os dados do novo endereço</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...addressForm}>
                        <form onSubmit={addressForm.handleSubmit(handleAddAddress)} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-2">
                              <FormField
                                control={addressForm.control}
                                name="type"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Tipo de Endereço</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Selecione o tipo" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="shipping">Endereço de Entrega</SelectItem>
                                        <SelectItem value="billing">Endereço de Cobrança</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormField
                              control={addressForm.control}
                              name="postal_code"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>CEP</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Input
                                        {...field}
                                        maxLength={8}
                                        placeholder="00000000"
                                        disabled={isLoadingCep}
                                        onChange={(e) => {
                                          const value = e.target.value.replace(/\D/g, '');
                                          handleCepChange(value, field);
                                        }}
                                      />
                                      {isLoadingCep && (
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                          <Loader2 className="h-4 w-4 animate-spin" />
                                        </div>
                                      )}
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={addressForm.control}
                              name="street"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Rua</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={addressForm.control}
                              name="number"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Número</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={addressForm.control}
                              name="complement"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Complemento</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={addressForm.control}
                              name="neighborhood"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Bairro</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={addressForm.control}
                              name="city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Cidade</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={addressForm.control}
                              name="state"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Estado</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      maxLength={2}
                                      style={{ textTransform: 'uppercase' }}
                                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={addressForm.control}
                              name="recipient_name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nome do Destinatário</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="col-span-2">
                              <FormField
                                control={addressForm.control}
                                name="is_default"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel>Definir como endereço padrão</FormLabel>
                                      <FormDescription>
                                        Este endereço será usado como padrão para entregas
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2 pt-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setIsAddingAddress(false);
                                addressForm.reset();
                              }}
                            >
                              Cancelar
                            </Button>
                            <Button type="submit" disabled={isSubmittingAddress}>
                              {isSubmittingAddress ? 'Adicionando...' : 'Adicionar Endereço'}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Privacidade e Consentimentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2" /> Privacidade e Consentimentos
          </CardTitle>
          <CardDescription>
            Gerencie suas preferências de privacidade e segurança da conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-6">
              <div className="flex flex-col space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Preferências de Comunicação
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Personalize como você deseja receber nossas comunicações e como seus dados são utilizados
                  </p>
                </div>
                <div className="grid gap-4">
                  <div className="flex items-start space-x-4 rounded-lg border p-4 bg-card hover:bg-accent/5 transition-colors">
                    <Checkbox
                      id="marketing_consent"
                      checked={consents.marketing}
                      onCheckedChange={(checked) => handleConsentUpdate('marketing', checked)}
                    />
                    <div className="space-y-1 leading-none">
                      <Label
                        htmlFor="marketing_consent"
                        className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Receber comunicações de marketing
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receba e-mails sobre promoções, novidades e ofertas especiais.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 rounded-lg border p-4 bg-card hover:bg-accent/5 transition-colors">
                    <Checkbox
                      id="data_usage_consent"
                      checked={consents.data_usage}
                      onCheckedChange={(checked) => handleConsentUpdate('data_usage', checked)}
                    />
                    <div className="space-y-1 leading-none">
                      <Label
                        htmlFor="data_usage_consent"
                        className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Permitir uso de dados para melhoria de serviço
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Ajude-nos a melhorar nossos serviços permitindo a análise de dados de uso (anonimizados).
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Trash2 className="h-5 w-5 text-destructive" />
                    Excluir Conta
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    A exclusão da conta é permanente e removerá todos os seus dados.
                  </p>
                </div>
                {!showDeleteConfirm ? (
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-fit"
                  >
                    Solicitar Exclusão de Conta
                  </Button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <p className="text-sm text-red-500">
                      Tem certeza que deseja excluir sua conta? Esta ação é irreversível.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={isDeletingAccount}
                        className="flex-1"
                      >
                        {isDeletingAccount ? 'Excluindo...' : 'Confirmar Exclusão'}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserProfile;


