import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './react-datepicker-extra.css';
import { HandCoins, Calendar, DollarSign, Loader2, AlertCircle, UserPlus } from 'lucide-react';
import { RootState } from '../../store.types';
import { Profile } from '../../types/daily-expenses';

export type LendFormProps = {
  amount: number;
  date: Date;
  borrower_profile_id: number;
  category_id?: number;
  account_id?: number;
  note?: string;
};

interface LendFormModalProps {
  onSuccess: () => void;
}

export function LendFormModal({ onSuccess }: LendFormModalProps) {
  const { categories, accounts } = useSelector((state: RootState) => state.dailyExpenses);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewProfileForm, setShowNewProfileForm] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<LendFormProps>({
    mode: 'onChange',
    defaultValues: {
      amount: 0,
      date: new Date(),
      borrower_profile_id: 0,
      category_id: undefined,
      account_id: undefined,
      note: '',
    },
  });

  // Load profiles on component mount
  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const { getProfiles } = await import('../../webservices/daily-expenses-ws');
        const profileData = await getProfiles();
        // Filter out self profile for borrower selection
        const borrowerProfiles = profileData.filter((p) => !p.is_self);
        setProfiles(borrowerProfiles);
      } catch (error) {
        console.error('Failed to load profiles:', error);
      }
    };
    loadProfiles();
  }, []);

  useEffect(() => {
    if (accounts.length > 0 && profiles.length > 0) {
      reset({
        amount: 0,
        date: new Date(),
        borrower_profile_id: profiles[0]?.id || 0,
        category_id: categories.find((c) => c.section === 'EXPENSE')?.id,
        account_id: accounts[0]?.id,
        note: '',
      });
    }
  }, [categories, accounts, profiles, reset]);

  const onSubmit = async (data: LendFormProps) => {
    setIsLoading(true);
    setError(null);

    try {
      // Import the API function
      const { createLendTransaction } = await import('../../webservices/daily-expenses-ws');

      await createLendTransaction({
        amount: Number(data.amount),
        date: data.date.toLocaleDateString('en-GB'),
        borrower_profile_id: Number(data.borrower_profile_id),
        category_id: Number(data.category_id),
        account_id: data.account_id,
        note: data.note,
      });

      // Reset form
      reset({
        amount: 0,
        date: new Date(),
        borrower_profile_id: profiles[0]?.id || 0,
        category_id: categories.find((c) => c.section === 'EXPENSE')?.id,
        account_id: accounts[0]?.id,
        note: '',
      });

      onSuccess();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create lend transaction. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewProfile = async () => {
    if (!newProfileName.trim()) return;

    try {
      const { createProfile } = await import('../../webservices/daily-expenses-ws');
      await createProfile({ name: newProfileName.trim(), is_self: false });

      // Reload profiles
      const { getProfiles } = await import('../../webservices/daily-expenses-ws');
      const profileData = await getProfiles();
      const borrowerProfiles = profileData.filter((p) => !p.is_self);
      setProfiles(borrowerProfiles);

      setNewProfileName('');
      setShowNewProfileForm(false);
    } catch (error) {
      console.error('Failed to create profile:', error);
      setError('Failed to create new profile');
    }
  };

  const expenseCategories = categories.filter((c) => c.section === 'EXPENSE');

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center space-x-2 text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* First Row - Amount and Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <DollarSign className="w-4 h-4 inline mr-2" />
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              className={`w-full px-4 py-2 bg-slate-700/50 border rounded-lg text-white text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.amount ? 'border-red-500/50' : 'border-slate-600/50'
              }`}
              placeholder="0.00"
              {...register('amount', {
                required: 'Amount is required',
                min: { value: 0.01, message: 'Amount must be greater than 0' },
              })}
            />
            {errors.amount && (
              <p className="text-red-400 text-xs mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.amount.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Date
            </label>
            <Controller
              name="date"
              control={control}
              rules={{ required: 'Date is required' }}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  selected={value}
                  onChange={onChange}
                  className={`w-full px-4 py-2 bg-slate-700/50 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.date ? 'border-red-500/50' : 'border-slate-600/50'
                  }`}
                />
              )}
            />
            {errors.date && (
              <p className="text-red-400 text-xs mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.date.message}
              </p>
            )}
          </div>
        </div>

        {/* Second Row - Borrower */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-300">Lend To (Borrower)</label>
            <button
              type="button"
              onClick={() => setShowNewProfileForm(!showNewProfileForm)}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
            >
              <UserPlus className="w-3 h-3" />
              <span>New Profile</span>
            </button>
          </div>

          {/* Quick Profile Creation */}
          {showNewProfileForm && (
            <div className="mb-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="Enter profile name"
                  className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && createNewProfile()}
                />
                <button
                  type="button"
                  onClick={createNewProfile}
                  disabled={!newProfileName.trim()}
                  className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewProfileForm(false);
                    setNewProfileName('');
                  }}
                  className="p-2 text-slate-400 hover:text-white"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <select
            className={`w-full px-4 py-2 bg-slate-700/50 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.borrower_profile_id ? 'border-red-500/50' : 'border-slate-600/50'
            }`}
            {...register('borrower_profile_id', { required: 'Please select a borrower' })}
          >
            <option value="" className="bg-slate-800">
              Select borrower
            </option>
            {profiles.map(({ id, name }) => (
              <option key={id} value={id} className="bg-slate-800">
                {name}
              </option>
            ))}
          </select>
          {errors.borrower_profile_id && (
            <p className="text-red-400 text-xs mt-1 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.borrower_profile_id.message}
            </p>
          )}
        </div>

        {/* Third Row - Category and Account */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Category (Optional)</label>
            <select
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register('category_id')}
            >
              <option value="" className="bg-slate-800">
                Select category
              </option>
              {expenseCategories.map(({ id, value, emoji }) => (
                <option key={id} value={id} className="bg-slate-800">
                  {emoji} {value}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Account (Optional)</label>
            <select
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register('account_id')}
            >
              <option value="" className="bg-slate-800">
                Select account
              </option>
              {accounts.map(({ id, value }) => (
                <option key={id} value={id} className="bg-slate-800">
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Note Field */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Note (Optional)</label>
          <textarea
            rows={2}
            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Add a note about this lend..."
            {...register('note')}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            disabled={isLoading || !isValid}
            className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Lend...</span>
              </>
            ) : (
              <>
                <HandCoins className="w-4 h-4" />
                <span>Create Lend</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
