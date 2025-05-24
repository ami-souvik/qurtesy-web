import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store.types';
import { createTransaction, createCategory } from '../../slices/daily-expenses-slice';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { CurrencyDisplay, convertCurrency } from '../currency';
import { currencyService } from '../../services/currency-service';

export const PhonePeImporter: React.FC = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.dailyExpenses.categories);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: number;
    failed: number;
    messages: string[];
  } | null>(null);

  // Categories to create if they don't exist
  const requiredCategories = [
    { name: 'Food & Dining', emoji: '🍽️' },
    { name: 'Groceries', emoji: '🛒' },
    { name: 'Entertainment', emoji: '🎬' },
    { name: 'Technology', emoji: '💻' },
    { name: 'Transportation', emoji: '🚗' },
    { name: 'Personal Transfers', emoji: '👤' },
    { name: 'Business', emoji: '💼' },
    { name: 'Household', emoji: '🏠' },
  ];
  // Complete PhonePe transactions from the statement
  const phonepeTransactions = [
    // Recent May 2025 transactions
    { date: '23/05/2025', merchant: 'Prapti Stores', amount: 32, category: 'Groceries' },
    { date: '23/05/2025', merchant: 'SANGITA NANDY', amount: 20, category: 'Personal Transfers' },
    { date: '22/05/2025', merchant: 'Blinkit', amount: 420, category: 'Groceries' },
    { date: '22/05/2025', merchant: 'ZOMATO', amount: 566.05, category: 'Food & Dining' },
    { date: '22/05/2025', merchant: 'Saradindu Cloud', amount: 300, category: 'Technology' },
    { date: '22/05/2025', merchant: 'Zomato Ltd', amount: 387.55, category: 'Food & Dining' },
    { date: '20/05/2025', merchant: 'DHIRENDRA MAITI', amount: 180, category: 'Personal Transfers' },
    { date: '20/05/2025', merchant: 'Zomato Online Order', amount: 661.75, category: 'Food & Dining' },
    { date: '20/05/2025', merchant: 'GAUTAM DEB', amount: 150, category: 'Personal Transfers' },
    { date: '19/05/2025', merchant: 'SANTOSH BHAGAT', amount: 195, category: 'Personal Transfers' },
    { date: '19/05/2025', merchant: 'DHAKESHWARI GLASS STORE', amount: 35, category: 'Household' },
    { date: '19/05/2025', merchant: 'Suraj Fuchka Stall', amount: 30, category: 'Food & Dining' },
    { date: '18/05/2025', merchant: 'S S RICE', amount: 430, category: 'Groceries' },
    { date: '18/05/2025', merchant: 'HOTEL AQUA VILLA', amount: 40, category: 'Food & Dining' },
    { date: '18/05/2025', merchant: 'HOTEL AQUA VILLA', amount: 616, category: 'Food & Dining' },
    { date: '18/05/2025', merchant: 'TUHIN ROY', amount: 1000, category: 'Personal Transfers' },
    { date: '18/05/2025', merchant: 'MAA TARA VARIETY STORES', amount: 120, category: 'Groceries' },
    { date: '18/05/2025', merchant: 'Molla Maniramed', amount: 150, category: 'Personal Transfers' },
    { date: '18/05/2025', merchant: 'GROFERS INDIA PRIVATE LIMITED', amount: 236, category: 'Groceries' },
    { date: '17/05/2025', merchant: 'RAUSHAN KUMAR', amount: 150, category: 'Personal Transfers' },
    { date: '17/05/2025', merchant: 'Saradindu Cloud', amount: 135, category: 'Technology' },
    { date: '17/05/2025', merchant: 'HTGFRIENDS FOOD and BEVERAGES', amount: 4931, category: 'Business' },
    { date: '17/05/2025', merchant: 'RANJIT KUMAR DAS', amount: 81, category: 'Personal Transfers' },
    { date: '17/05/2025', merchant: 'CHIRANJIT DALAI', amount: 130, category: 'Personal Transfers' },
    { date: '15/05/2025', merchant: 'Sweet kon', amount: 90, category: 'Food & Dining' },
    { date: '15/05/2025', merchant: 'SUDIP PAUL', amount: 150, category: 'Personal Transfers' },
    { date: '13/05/2025', merchant: 'SUMAN BITTEL', amount: 150, category: 'Personal Transfers' },
    { date: '13/05/2025', merchant: 'WWW TATAPLAYBINGE COM', amount: 249, category: 'Entertainment' },
    { date: '12/05/2025', merchant: 'AVIJIT DAS', amount: 160, category: 'Personal Transfers' },
    { date: '10/05/2025', merchant: 'SADHANANDA STORE', amount: 177, category: 'Groceries' },
    { date: '09/05/2025', merchant: 'FRESH JUICE AND FRUTIS CORNER', amount: 55, category: 'Food & Dining' },
    { date: '09/05/2025', merchant: 'AWS India', amount: 4.26, category: 'Technology' },
    { date: '05/05/2025', merchant: 'Shreya', amount: 1, category: 'Personal Transfers' },
    { date: '04/05/2025', merchant: 'GOLDEN JOY', amount: 5070, category: 'Business' },
    { date: '03/05/2025', merchant: 'Rishu Cafe', amount: 3500, category: 'Business' },
    { date: '03/05/2025', merchant: 'Achintya Kumar Sarkar', amount: 530, category: 'Personal Transfers' },
    { date: '03/05/2025', merchant: 'SOVAN PAN STALL', amount: 292, category: 'Food & Dining' },
    { date: '03/05/2025', merchant: 'Starmax Infotech Pvt Ltd', amount: 350, category: 'Technology' },
    { date: '02/05/2025', merchant: 'SABIRS HOTEL', amount: 567, category: 'Food & Dining' },
    { date: '02/05/2025', merchant: 'GROFERS INDIA PRIVATE LIMITED', amount: 2040, category: 'Groceries' },
    { date: '01/05/2025', merchant: 'Mr. ADNAN DANISH', amount: 170, category: 'Personal Transfers' },
    { date: '01/05/2025', merchant: 'UTSAB KITCHEN', amount: 70, category: 'Food & Dining' },
    { date: '01/05/2025', merchant: 'UTSAB KITCHEN', amount: 260, category: 'Food & Dining' },
    { date: '01/05/2025', merchant: 'NETFLIX COM', amount: 199, category: 'Entertainment' },
    // April 2025 transactions
    { date: '29/04/2025', merchant: 'Vuri Vhoje', amount: 70, category: 'Food & Dining' },
    { date: '29/04/2025', merchant: 'NEW HAJI BIRYANI', amount: 260, category: 'Food & Dining' },
    { date: '28/04/2025', merchant: 'UTSAB KITCHEN', amount: 180, category: 'Food & Dining' },
    { date: '27/04/2025', merchant: 'IRCTC UTS', amount: 100, category: 'Transportation' },
    { date: '26/04/2025', merchant: 'MOHAMMAD NAUSAD', amount: 140, category: 'Personal Transfers' },
    { date: '25/04/2025', merchant: 'Subhasish Bhattacharya', amount: 160, category: 'Personal Transfers' },
    { date: '25/04/2025', merchant: 'Shreyas', amount: 240, category: 'Personal Transfers' },
    { date: '24/04/2025', merchant: 'M S ALDO CAFE EATERY WORKSPACE', amount: 730, category: 'Business' },
  ];
  // Helper function to find or create category
  const findOrCreateCategory = async (categoryName: string) => {
    const existingCategory = categories.find((cat) => cat.value === categoryName);
    if (existingCategory) {
      return existingCategory.id;
    }

    // Create new category
    const categoryData = requiredCategories.find((cat) => cat.name === categoryName);
    if (categoryData) {
      await dispatch(
        createCategory({
          value: categoryData.name,
          emoji: categoryData.emoji,
        })
      );

      // Return the newly created category ID (assuming it's the last one)
      return categories.length + 1;
    }

    return undefined;
  };

  // Import all PhonePe transactions
  const handleImportTransactions = async () => {
    setImporting(true);
    setImportResults(null);

    const results = {
      success: 0,
      failed: 0,
      messages: [] as string[],
    };

    try {
      // First, ensure all required categories exist
      for (const categoryData of requiredCategories) {
        const existingCategory = categories.find((cat) => cat.value === categoryData.name);
        if (!existingCategory) {
          await dispatch(
            createCategory({
              value: categoryData.name,
              emoji: categoryData.emoji,
            })
          );
          results.messages.push(`Created category: ${categoryData.name}`);
        }
      }

      // Then import transactions
      for (const transaction of phonepeTransactions) {
        try {
          const categoryId = await findOrCreateCategory(transaction.category);

          const convertedAmount = convertCurrency(transaction.amount, 'INR');

          await dispatch(
            createTransaction({
              date: transaction.date,
              amount: convertedAmount,
              category_id: categoryId,
              note: `${transaction.merchant} (₹${transaction.amount})`,
            })
          );

          results.success++;
        } catch (error) {
          results.failed++;
          results.messages.push(`Failed to import: ${transaction.merchant} - ${error}`);
        }
      }

      results.messages.unshift(`Import completed: ${results.success} successful, ${results.failed} failed`);
    } catch (error) {
      results.messages.push(`Import error: ${error}`);
    }

    setImportResults(results);
    setImporting(false);
  };
  const totalTransactions = phonepeTransactions.length;
  const totalAmountINR = phonepeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const baseCurrency = currencyService.getBaseCurrency();
  const convertedAmount =
    baseCurrency === 'INR' ? totalAmountINR : convertCurrency(totalAmountINR, 'INR', baseCurrency);

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Upload className="h-6 w-6 text-purple-400" />
        <h2 className="text-xl font-semibold text-white">PhonePe Statement Import</h2>
      </div>

      <div className="space-y-4">
        {/* Summary */}
        <div className="glass-card rounded-lg p-4 bg-purple-500/10 border-purple-500/20">
          <h3 className="font-medium text-white mb-2">Statement Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Total Transactions:</span>
              <span className="ml-2 text-white font-medium">{totalTransactions}</span>
            </div>
            <div>
              <span className="text-slate-400">Total Amount:</span>
              <span className="ml-2 text-white font-medium">
                <CurrencyDisplay amount={convertedAmount} showConversion originalCurrency="INR" />
              </span>
            </div>
            <div>
              <span className="text-slate-400">Date Range:</span>
              <span className="ml-2 text-white font-medium">24 Apr - 24 May 2025</span>
            </div>
            <div>
              <span className="text-slate-400">Categories:</span>
              <span className="ml-2 text-white font-medium">{requiredCategories.length}</span>
            </div>
          </div>
        </div>

        {/* Import Button */}
        <button
          onClick={handleImportTransactions}
          disabled={importing}
          className="w-full glass-button px-6 py-3 rounded-lg bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 transition-colors disabled:opacity-50"
        >
          <div className="flex items-center justify-center space-x-2">
            {importing ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileText className="h-5 w-5" />}
            <span>{importing ? 'Importing Transactions...' : 'Import PhonePe Transactions'}</span>
          </div>
        </button>

        {/* Results */}
        {importResults && (
          <div className="glass-card rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              {importResults.failed === 0 ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-orange-400" />
              )}
              <h3 className="font-medium text-white">Import Results</h3>
            </div>
            <div className="space-y-2 text-sm">
              {importResults.messages.map((message, index) => (
                <p key={index} className="text-slate-300">
                  {message}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
