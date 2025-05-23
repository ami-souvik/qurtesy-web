import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Edit3, Trash2, Plus } from 'lucide-react';
import { AppDispatch, RootState } from '../../store.types';
import { Account, CreateAccount, UpdateAccount } from '../../types/daily-expenses';
import { createAccount, updateAccount, deleteAccount } from '../../slices/daily-expenses-slice';

export function AccountForm() {
  const modalRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setVisible(false);
      }
    };
    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible]);

  const dispatch = useDispatch<AppDispatch>();
  const { accounts } = useSelector((state: RootState) => state.dailyExpenses);
  const { register, handleSubmit, reset, setValue } = useForm<CreateAccount | UpdateAccount>();

  const add = () => {
    reset({
      id: null,
      value: '',
    });
  };

  const onSubmit = (data: CreateAccount | UpdateAccount) => {
    if (data?.id) {
      dispatch(updateAccount(data));
    } else {
      dispatch(createAccount(data));
    }
    reset();
  };

  const handleDelete = (id: number) => {
    if (confirm('Do you want to delete this account?')) dispatch(deleteAccount(id));
  };

  return (
    <div>
      <button
        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-200"
        onClick={() => setVisible(true)}
        title="Manage Accounts"
      >
        <Edit3 className="w-4 h-4" />
      </button>

      <div ref={modalRef} className="relative">
        {visible && (
          <div className="absolute top-0 right-0 w-80 glass-card border border-slate-700/50 rounded-xl p-4 z-50">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Manage Accounts</h3>

              {/* Accounts List */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {accounts.map((account: Account) => (
                  <div key={account.id} className="flex items-center justify-between p-2 bg-slate-700/30 rounded-lg">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => {
                        setValue('id', account.id);
                        setValue('value', account.value);
                      }}
                    >
                      <p className="text-white">{account.value}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add/Edit Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Account Name</label>
                  <input
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter account name"
                    {...register('value', { required: true })}
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={add}
                    className="flex items-center space-x-1 px-3 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New</span>
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
