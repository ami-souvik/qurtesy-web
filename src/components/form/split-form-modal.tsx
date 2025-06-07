import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './react-datepicker-extra.css';
import { X, Users, Calendar, DollarSign, Loader2, AlertCircle, UserPlus } from 'lucide-react';
import { RootState } from '../../store.types';
import { Profile } from '../../types/daily-expenses';

export type SplitFormProps = {
  name: string;
  total_amount: number;
  date: Date;
  category_id?: number;
  created_by_account_id: number;
  participants: { profile_id: number }[];
  note?: string;
};

interface SplitFormModalProps {
  onSuccess: () => void;
}

export function SplitFormModal({ onSuccess }: SplitFormModalProps) {
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
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<SplitFormProps>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      total_amount: 0,
      date: new Date(),
      category_id: undefined,
      created_by_account_id: undefined,
      participants: [{ profile_id: 0 }],
      note: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'participants',
  });

  const watchedData = watch();
  const shareAmount = watchedData.total_amount && fields.length > 0 ? watchedData.total_amount / fields.length : 0;

  // Load profiles on component mount
  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const { getProfiles } = await import('../../webservices/daily-expenses-ws');
        const profileData = await getProfiles();
        setProfiles(profileData);
      } catch (error) {
        console.error('Failed to load profiles:', error);
      }
    };
    loadProfiles();
  }, []);

  useEffect(() => {
    if (accounts.length > 0 && profiles.length > 0) {
      // Find the self profile to use as default participant
      const selfProfile = profiles.find((p) => p.is_self);

      reset({
        name: '',
        total_amount: 0,
        date: new Date(),
        category_id: categories.find((c) => c.section === 'EXPENSE')?.id,
        created_by_account_id: accounts[0]?.id,
        participants: selfProfile ? [{ profile_id: selfProfile.id }] : [{ profile_id: profiles[0]?.id || 0 }],
        note: '',
      });
    }
  }, [categories, accounts, profiles, reset]);

  const onSubmit = async (data: SplitFormProps) => {
    setIsLoading(true);
    setError(null);

    try {
      // Import the API function
      const { createSplitTransaction } = await import('../../webservices/daily-expenses-ws');

      await createSplitTransaction({
        name: data.name,
        total_amount: data.total_amount,
        date: data.date.toLocaleDateString('en-GB'),
        category_id: data.category_id,
        created_by_account_id: data.created_by_account_id,
        participants: data.participants,
        note: data.note,
      });

      // Reset form
      const selfProfile = profiles.find((p) => p.is_self);
      reset({
        name: '',
        total_amount: 0,
        date: new Date(),
        category_id: categories.find((c) => c.section === 'EXPENSE')?.id,
        created_by_account_id: accounts[0]?.id,
        participants: selfProfile ? [{ profile_id: selfProfile.id }] : [{ profile_id: profiles[0]?.id || 0 }],
        note: '',
      });

      onSuccess();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create split transaction. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const addParticipant = () => {
    if (profiles.length > fields.length) {
      // Find a profile that's not already added
      const usedProfileIds = fields.map((field) => field.profile_id);
      const availableProfile = profiles.find((profile) => !usedProfileIds.includes(profile.id));
      if (availableProfile) {
        append({ profile_id: availableProfile.id });
      }
    }
  };

  const removeParticipant = (index: number) => {
    if (fields.length > 1) {
      remove(index);
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
      setProfiles(profileData);

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
        {/* First Row - Name and Total Amount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Users className="w-4 h-4 inline mr-2" />
              Split Name
            </label>
            <input
              type="text"
              className={`w-full px-4 py-2 bg-slate-700/50 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-500/50' : 'border-slate-600/50'
              }`}
              placeholder="e.g., Dinner at Restaurant"
              {...register('name', { required: 'Split name is required' })}
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <DollarSign className="w-4 h-4 inline mr-2" />
              Total Amount
            </label>
            <input
              type="number"
              step="0.01"
              className={`w-full px-4 py-2 bg-slate-700/50 border rounded-lg text-white text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.total_amount ? 'border-red-500/50' : 'border-slate-600/50'
              }`}
              placeholder="0.00"
              {...register('total_amount', {
                required: 'Total amount is required',
                min: { value: 0.01, message: 'Amount must be greater than 0' },
              })}
            />
            {errors.total_amount && (
              <p className="text-red-400 text-xs mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.total_amount.message}
              </p>
            )}
          </div>
        </div>

        {/* Second Row - Date and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
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
        </div>

        {/* Who Paid Initially */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Who Paid Initially?</label>
          <select
            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            {...register('created_by_account_id', { required: 'Please select who paid initially' })}
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
          {errors.created_by_account_id && (
            <p className="text-red-400 text-xs mt-1 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.created_by_account_id.message}
            </p>
          )}
        </div>

        {/* Participants */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-slate-300">Participants ({fields.length})</label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowNewProfileForm(!showNewProfileForm)}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
              >
                <UserPlus className="w-3 h-3" />
                <span>New Profile</span>
              </button>
              <button
                type="button"
                onClick={addParticipant}
                disabled={profiles.length <= fields.length}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserPlus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </div>
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
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                <div className="flex-1">
                  <select
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register(`participants.${index}.profile_id` as const, { required: true })}
                  >
                    <option value="" className="bg-slate-800">
                      Select participant
                    </option>
                    {profiles.map(({ id, name }) => (
                      <option key={id} value={id} className="bg-slate-800">
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-sm text-slate-400 min-w-fit">₹{shareAmount.toFixed(2)} each</div>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeParticipant(index)}
                    className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Note Field */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Note (Optional)</label>
          <textarea
            rows={2}
            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Add a note about this split..."
            {...register('note')}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            disabled={isLoading || !isValid || fields.length < 2}
            className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Split...</span>
              </>
            ) : (
              <>
                <Users className="w-4 h-4" />
                <span>Create Split</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
