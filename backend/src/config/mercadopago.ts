import { MercadoPagoConfig, Preference, Payment, CardPayment } from 'mercadopago';

// Configuração da instância principal
const client = new MercadoPagoConfig({
  accessToken: 'APP_USR-7961241010251452-080720-83b27146761c407eb34858816d32b78e-177222356'
});

// Exporta clientes separados para preferências, pagamentos e pagamentos com cartão
export const preferenceClient = new Preference(client);
export const paymentClient = new Payment(client);
export const cardPaymentClient = new CardPayment(client);

// Chave pública para uso no frontend
export const MP_PUBLIC_KEY = 'APP_USR-51ffe982-9d85-436d-a7ee-70e593129e5a';
