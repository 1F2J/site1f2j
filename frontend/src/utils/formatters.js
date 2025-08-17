export function formatPhone(value) {
  if (!value) return '';
  
  // Remove todos os caracteres não numéricos
  const numbers = value.replace(/\D/g, '');
  
  // Aplica a máscara conforme o tamanho do número
  if (numbers.length <= 11) {
    return numbers
      .replace(/^(\d{2})(\d)/g, '($1) $2') // Adiciona parênteses no DDD
      .replace(numbers.length === 11 ? /(\d{5})(\d)/ : /(\d{4})(\d)/, '$1-$2'); // Adiciona hífen
  }
  
  return numbers;
}

export function formatCep(value) {
  if (!value) return '';
  
  // Remove todos os caracteres não numéricos
  const numbers = value.replace(/\D/g, '');
  
  // Limita a 8 dígitos
  if (numbers.length > 8) {
    return numbers.slice(0, 8);
  }
  
  return numbers;
}