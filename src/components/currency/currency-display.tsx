import React from 'react';
import { formatCurrency, formatWithBaseCurrency, Currency } from '../../services/currency-service';

interface CurrencyDisplayProps {
  amount: number;
  currency?: Currency;
  showConversion?: boolean;
  originalCurrency?: Currency;
  className?: string;
}

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  amount,
  currency,
  showConversion = false,
  originalCurrency,
  className = '',
}) => {
  if (showConversion && originalCurrency) {
    return <span className={className}>{formatWithBaseCurrency(amount, originalCurrency)}</span>;
  }

  return <span className={className}>{formatCurrency(amount, currency)}</span>;
};
