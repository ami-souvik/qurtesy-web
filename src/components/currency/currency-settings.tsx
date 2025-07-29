import React from 'react';
import { useCurrency } from '../../hooks';
import { CURRENCIES, Currency } from '../../services/currency-service';
import { Settings, Globe, ArrowRightLeft } from 'lucide-react';

export const CurrencySettings: React.FC = () => {
  const { currentCurrency, changeCurrency, getAllCurrencies } = useCurrency();

  const handleCurrencyChange = (newCurrency: Currency) => {
    changeCurrency(newCurrency);
  };

  const getExchangeRateDisplay = () => {
    const usdToInr = 83.0; // This would come from the service
    const inrToUsd = 1 / 83.0;

    return currentCurrency === 'USD' ? `1 USD = ₹${usdToInr.toFixed(2)}` : `₹1 = $${inrToUsd.toFixed(4)}`;
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="h-6 w-6 text-blue-400" />
        <h2 className="font-semibold text-white">Currency Settings</h2>
      </div>

      <div className="space-y-4">
        {/* Current Currency Display */}
        <div className="glass-card rounded-lg p-4 bg-blue-500/10 border-blue-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-blue-400" />
              <div>
                <p className="font-medium text-white">Current Currency</p>
                <p className="text-sm text-slate-400">{CURRENCIES[currentCurrency].name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-blue-400">
                {CURRENCIES[currentCurrency].symbol} {currentCurrency}
              </p>
              <p className="text-xs text-slate-400">{getExchangeRateDisplay()}</p>
            </div>
          </div>
        </div>

        {/* Currency Options */}
        <div>
          <h3 className="font-medium text-white mb-3">Available Currencies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {getAllCurrencies().map((currency) => (
              <button
                key={currency.code}
                onClick={() => handleCurrencyChange(currency.code)}
                className={`p-4 rounded-lg border transition-all ${
                  currentCurrency === currency.code
                    ? 'bg-blue-600/20 border-blue-500/50 text-blue-400'
                    : 'glass-card border-white/10 text-slate-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{currency.symbol}</span>
                  <div className="text-left">
                    <p className="font-medium">{currency.code}</p>
                    <p className="text-xs opacity-75">{currency.name}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Exchange Rate Info */}
        <div className="glass-card rounded-lg p-4 bg-slate-500/10">
          <div className="flex items-center space-x-2 mb-2">
            <ArrowRightLeft className="h-4 w-4 text-slate-400" />
            <h4 className="font-medium text-white">Exchange Rate Information</h4>
          </div>
          <div className="text-sm text-slate-400 space-y-1">
            <p>• Exchange rates are updated automatically</p>
            <p>• All amounts are converted for display purposes</p>
            <p>• Original transaction amounts are preserved</p>
            <p>• Rates: 1 USD ≈ ₹83.00 (approximate)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
