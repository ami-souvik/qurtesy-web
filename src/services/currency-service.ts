// Currency service for handling multiple currencies
export type Currency = 'USD' | 'INR';

export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  name: string;
  decimals: number;
}

export interface ExchangeRate {
  from: Currency;
  to: Currency;
  rate: number;
  lastUpdated: Date;
}

// Currency configurations
export const CURRENCIES: Record<Currency, CurrencyInfo> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    decimals: 2,
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    decimals: 2,
  },
};

// Default exchange rates (fallback)
const DEFAULT_RATES: Record<string, number> = {
  USD_to_INR: 83.0,
  INR_to_USD: 1 / 83.0,
};
class CurrencyService {
  private exchangeRates: Map<string, ExchangeRate> = new Map();
  private baseCurrency: Currency = 'USD';

  constructor() {
    this.initializeDefaultRates();
    this.loadUserPreferences();
  }

  private initializeDefaultRates() {
    const now = new Date();

    this.exchangeRates.set('USD_to_INR', {
      from: 'USD',
      to: 'INR',
      rate: DEFAULT_RATES.USD_to_INR,
      lastUpdated: now,
    });

    this.exchangeRates.set('INR_to_USD', {
      from: 'INR',
      to: 'USD',
      rate: DEFAULT_RATES.INR_to_USD,
      lastUpdated: now,
    });
  }

  private loadUserPreferences() {
    try {
      const savedCurrency = localStorage.getItem('preferred_currency') as Currency;
      if (savedCurrency && CURRENCIES[savedCurrency]) {
        this.baseCurrency = savedCurrency;
      }
    } catch (error) {
      console.warn('Could not load currency preferences:', error);
    }
  }

  public setBaseCurrency(currency: Currency) {
    this.baseCurrency = currency;
    try {
      localStorage.setItem('preferred_currency', currency);
    } catch (error) {
      console.warn('Could not save currency preference:', error);
    }
  }

  public getBaseCurrency(): Currency {
    return this.baseCurrency;
  }

  public getCurrencyInfo(currency: Currency): CurrencyInfo {
    return CURRENCIES[currency];
  }

  public getAllCurrencies(): CurrencyInfo[] {
    return Object.values(CURRENCIES);
  }
  // Convert amount from one currency to another
  public convert(amount: number, from: Currency, to: Currency): number {
    if (from === to) return amount;

    const rateKey = `${from}_to_${to}`;
    const exchangeRate = this.exchangeRates.get(rateKey);

    if (!exchangeRate) {
      console.warn(`Exchange rate not found for ${from} to ${to}`);
      return amount;
    }

    return Math.round(amount * exchangeRate.rate * 100) / 100;
  }

  // Format amount with currency symbol and proper decimals
  public formatAmount(amount: number, currency: Currency, showSymbol: boolean = true): string {
    const currencyInfo = this.getCurrencyInfo(currency);
    const formattedAmount = amount.toFixed(currencyInfo.decimals);

    if (showSymbol) {
      return `${currencyInfo.symbol} ${formattedAmount}`;
    }

    return formattedAmount;
  }

  // Convert amount to base currency for display
  public convertToBaseCurrency(amount: number, fromCurrency: Currency): number {
    return this.convert(amount, fromCurrency, this.baseCurrency);
  }

  // Get exchange rate between two currencies
  public getExchangeRate(from: Currency, to: Currency): number {
    if (from === to) return 1;

    const rateKey = `${from}_to_${to}`;
    const exchangeRate = this.exchangeRates.get(rateKey);

    return exchangeRate?.rate || 1;
  }

  // Format amount with currency conversion info
  public formatWithConversion(amount: number, fromCurrency: Currency): string {
    if (fromCurrency === this.baseCurrency) {
      return this.formatAmount(amount, fromCurrency);
    }

    const convertedAmount = this.convert(amount, fromCurrency, this.baseCurrency);

    return `${this.formatAmount(convertedAmount, this.baseCurrency)} (${this.formatAmount(amount, fromCurrency)})`;
  }
}
// Create singleton instance
export const currencyService = new CurrencyService();

// Utility functions for components
export const formatCurrency = (amount: number, currency?: Currency) => {
  const targetCurrency = currency || currencyService.getBaseCurrency();
  return currencyService.formatAmount(amount, targetCurrency);
};

export const convertCurrency = (amount: number, from: Currency, to?: Currency) => {
  const targetCurrency = to || currencyService.getBaseCurrency();
  return currencyService.convert(amount, from, targetCurrency);
};

export const formatWithBaseCurrency = (amount: number, fromCurrency: Currency) => {
  return currencyService.formatWithConversion(amount, fromCurrency);
};
