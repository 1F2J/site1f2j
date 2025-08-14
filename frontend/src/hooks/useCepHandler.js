import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export default function useCepHandler(addressForm) {
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const handleCepChange = useCallback(async (value, field) => {
    if (value.length <= 8) {
      field.onChange(value);
      
      if (value.length === 8) {
        setIsLoadingCep(true);
        try {
          const response = await fetch(`https://viacep.com.br/ws/${value}/json/`);
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
    }
  }, [addressForm]);

  return { isLoadingCep, handleCepChange };
}