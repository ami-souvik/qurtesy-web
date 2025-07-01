import React from 'react';
import { formatCurrency, formatWithBaseCurrency, Currency } from '../../services/currency-service';
import { useCurrency } from '../../hooks';

interface CurrencyDisplayProps {
  amount: number;
  showConversion?: boolean;
  originalCurrency?: Currency;
  className?: string;
}

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  amount,
  showConversion = false,
  originalCurrency,
  className = '',
}) => {
  const { currentCurrency } = useCurrency();

  if (showConversion && originalCurrency) {
    return <span className={className}>{formatWithBaseCurrency(amount, originalCurrency)}</span>;
  }

  return <span className={className}>{formatCurrency(amount, currentCurrency)}</span>;
};
