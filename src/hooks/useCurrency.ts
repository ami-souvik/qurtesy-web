import { useState, useEffect } from 'react';
import { currencyService, Currency } from '../services/currency-service';

export const useCurrency = () => {
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(currencyService.getBaseCurrency());

  useEffect(() => {
    const handleCurrencyChange = (event: CustomEvent) => {
      setCurrentCurrency(event.detail.currency);
    };

    // Listen for currency change events
    window.addEventListener('currencyChanged', handleCurrencyChange as EventListener);

    return () => {
      window.removeEventListener('currencyChanged', handleCurrencyChange as EventListener);
    };
  }, []);

  const changeCurrency = (newCurrency: Currency) => {
    currencyService.setBaseCurrency(newCurrency);
    setCurrentCurrency(newCurrency);

    // Dispatch custom event
    window.dispatchEvent(
      new CustomEvent('currencyChanged', {
        detail: { currency: newCurrency },
      })
    );
  };

  const formatAmount = (amount: number, currency?: Currency) => {
    const targetCurrency = currency || currentCurrency;
    return currencyService.formatAmount(amount, targetCurrency);
  };

  const convertAmount = (amount: number, from: Currency, to?: Currency) => {
    const targetCurrency = to || currentCurrency;
    return currencyService.convert(amount, from, targetCurrency);
  };

  return {
    currentCurrency,
    changeCurrency,
    formatAmount,
    convertAmount,
    getCurrencyInfo: currencyService.getCurrencyInfo.bind(currencyService),
    getAllCurrencies: currencyService.getAllCurrencies.bind(currencyService),
  };
};

export default useCurrency;
