let mercadoPago = null;

export const loadMercadoPago = async () => {
  if (mercadoPago) return mercadoPago;

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.onload = () => {
      mercadoPago = new window.MercadoPago('APP_USR-51ffe982-9d85-436d-a7ee-70e593129e5a');
      resolve(mercadoPago);
    };
    script.onerror = (error) => reject(error);
    document.body.appendChild(script);
  });
};