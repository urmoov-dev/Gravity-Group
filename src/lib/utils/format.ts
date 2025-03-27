/**
 * Formata um valor numérico para moeda brasileira (BRL)
 * @param value - Valor a ser formatado
 * @param options - Opções adicionais de formatação
 * @returns String formatada como moeda
 */
export function formatCurrency(
  value: number,
  options: { 
    minimumFractionDigits?: number; 
    maximumFractionDigits?: number;
    currency?: string;
  } = {}
): string {
  const { 
    minimumFractionDigits = 0, 
    maximumFractionDigits = 0,
    currency = 'BRL'
  } = options;

  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits
  });
}

/**
 * Formata um número para exibição com separador de milhares
 * @param value - Valor a ser formatado
 * @returns String formatada com separador de milhares
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('pt-BR');
}

/**
 * Formata uma porcentagem para exibição
 * @param value - Valor a ser formatado (ex: 0.05 para 5%)
 * @param options - Opções adicionais de formatação
 * @returns String formatada como porcentagem
 */
export function formatPercent(
  value: number,
  options: { 
    minimumFractionDigits?: number; 
    maximumFractionDigits?: number;
    plusSign?: boolean;
  } = {}
): string {
  const { 
    minimumFractionDigits = 2, 
    maximumFractionDigits = 2,
    plusSign = false
  } = options;

  const formatted = (value * 100).toLocaleString('pt-BR', {
    minimumFractionDigits,
    maximumFractionDigits
  });

  const prefix = value > 0 && plusSign ? '+' : '';
  return `${prefix}${formatted}%`;
} 