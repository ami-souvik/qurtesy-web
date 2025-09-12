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
    return <p className={className}>{formatWithBaseCurrency(amount, originalCurrency)}</p>;
  }
  return <p className={className}>{formatCurrency(amount, currentCurrency)}</p>;
};
