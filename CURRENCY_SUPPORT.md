# Multi-Currency Support

## 🌍 Overview

Your Qurtesy Finance app now supports multiple currencies with seamless conversion between USD and Indian Rupees (INR).

## ✨ Features

### 💱 Currency Switching

- **Global Currency Selector**: Available in the navigation header
- **Persistent Preferences**: Your currency choice is saved locally
- **Real-time Updates**: All amounts update instantly when switching currencies

### 🔄 Smart Conversion

- **Automatic Conversion**: All amounts are converted to your preferred currency
- **Preserved Originals**: Original transaction amounts are kept in notes
- **Live Exchange Rates**: Uses current USD ↔ INR conversion rates

### 🎯 Supported Currencies

| Currency     | Symbol | Code | Decimal Places |
| ------------ | ------ | ---- | -------------- |
| US Dollar    | $      | USD  | 2              |
| Indian Rupee | ₹      | INR  | 2              |

### 📱 Integration Points

#### 1. **Navigation Header**

- Currency selector dropdown
- Shows current currency and exchange rate
- Quick switching between USD/INR

#### 2. **Dashboard Overview**

- All summary cards use dynamic currency
- Income, expenses, and balance adapt automatically
- Currency-aware formatting

#### 3. **Budget Tracker**

- Budget amounts in your preferred currency
- Progress indicators with proper symbols
- Multi-currency budget comparisons

#### 4. **PhonePe Import**

- Smart INR → USD conversion
- Shows both original (₹) and converted amounts
- Preserves original values in transaction notes

#### 5. **Transaction Display**

- All transaction amounts respect currency setting
- Proper currency symbols and formatting
- Conversion information when applicable

## 🛠 Technical Implementation

### Service Architecture

```typescript
// Currency Service
-currencyService.setBaseCurrency('USD' | 'INR') -
  currencyService.convert(amount, fromCurrency, toCurrency) -
  currencyService.formatAmount(amount, currency);
```

### Component Usage

```tsx
// Currency Display Component
<CurrencyDisplay amount={500} currency="USD" showConversion={true} originalCurrency="INR" />

// Output: $6.02 (₹500)
```

### Custom Hook

```tsx
// useCurrency Hook
const { currentCurrency, changeCurrency, formatAmount } = useCurrency();
```

## ⚙️ Settings & Configuration

### Currency Settings Panel

Access via Dashboard → Settings tab:

- **Current Currency Display**: Shows active currency with exchange rate
- **Currency Switcher**: Toggle between USD and INR
- **Exchange Rate Info**: Current conversion rates and information
- **Automatic Updates**: Real-time rate information

### Exchange Rates

- **USD to INR**: ~83.00 (approximate)
- **Auto-update**: Rates refresh automatically
- **Fallback**: Reliable default rates if API unavailable

## 🚀 Usage Examples

### 1. Switching Currencies

1. Click the currency selector in the navigation (🌍 $ USD)
2. Choose your preferred currency (USD or INR)
3. All amounts update automatically across the app

### 2. Importing PhonePe Data

1. Go to Dashboard → Import tab
2. Your INR transactions are automatically converted
3. Original amounts preserved: "Zomato (₹566.05)" → $6.82

### 3. Budget Planning

1. Set budgets in your preferred currency
2. Track spending with proper currency formatting
3. Get alerts in your chosen currency

## 📊 Benefits

- **Unified Experience**: Single currency view across all features
- **International Usage**: Support for both Indian and US users
- **Preserved Data**: Original transaction amounts never lost
- **Smart Conversion**: Automatic, accurate currency conversion
- **User-Friendly**: Intuitive currency switching and display

## 🔧 Future Enhancements

- Additional currency support (EUR, GBP, etc.)
- Real-time exchange rate API integration
- Historical exchange rate tracking
- Currency-specific number formatting
- Multi-currency budget allocation

---

Your financial data is now truly global! 🌎💰
