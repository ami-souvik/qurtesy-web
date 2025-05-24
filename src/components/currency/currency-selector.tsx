import React, { useState, useEffect } from 'react';
import { currencyService, Currency, CURRENCIES } from '../../services/currency-service';
import { Globe, ArrowUpDown } from 'lucide-react';

export const CurrencySelector: React.FC = () => {
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(currencyService.getBaseCurrency());
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setCurrentCurrency(currencyService.getBaseCurrency());
  }, []);

  const handleCurrencyChange = (newCurrency: Currency) => {
    currencyService.setBaseCurrency(newCurrency);
    setCurrentCurrency(newCurrency);
    setShowDropdown(false);

    // Trigger a custom event to notify other components
    window.dispatchEvent(
      new CustomEvent('currencyChanged', {
        detail: { currency: newCurrency },
      })
    );
  };

  const getCurrentCurrencyInfo = () => CURRENCIES[currentCurrency];

  return (
    <div className="relative">
      {/* Currency Selector Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 px-3 py-2 glass-button rounded-lg hover:bg-white/10 transition-colors"
      >
        <Globe className="h-4 w-4 text-slate-400" />
        <span className="font-medium text-white">
          {getCurrentCurrencyInfo().symbol} {getCurrentCurrencyInfo().code}
        </span>
        <ArrowUpDown className="h-3 w-3 text-slate-400" />
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-0 top-12 w-48 glass-card rounded-lg border border-white/10 z-50">
          <div className="p-2">
            {Object.values(CURRENCIES).map((currency) => (
              <button
                key={currency.code}
                onClick={() => handleCurrencyChange(currency.code)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                  currentCurrency === currency.code ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-white/5 text-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{currency.symbol}</span>
                  <div className="text-left">
                    <div className="font-medium">{currency.code}</div>
                    <div className="text-xs text-slate-400">{currency.name}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
