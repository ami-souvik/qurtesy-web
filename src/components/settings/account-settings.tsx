import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store.types';
import { fetchAccounts, createAccount, updateAccount, deleteAccount } from '../../slices/daily-expenses-slice';
import { Account, CreateAccount, UpdateAccount } from '../../types/daily-expenses';
import { CurrencyDisplay } from '../currency';
import { Button } from '../action/button';
import { PageWrapper, StatCard } from '../layout';
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Wallet,
  DollarSign,
  Building2,
  CreditCard,
  Landmark,
  PiggyBank,
} from 'lucide-react';

const accountIcons = {
  savings: PiggyBank,
  checking: Building2,
  credit: CreditCard,
  investment: Landmark,
  cash: Wallet,
  default: DollarSign,
};

export const AccountSettings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const accounts = useSelector((state: RootState) => state.dailyExpenses.accounts);

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newAccount, setNewAccount] = useState<CreateAccount>({ value: '', balance: 0 });
  const [editAccount, setEditAccount] = useState<UpdateAccount>({ id: 0, value: '', balance: 0 });

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  const handleCreateAccount = async () => {
    if (newAccount.value.trim()) {
      await dispatch(createAccount(newAccount));
      setNewAccount({ value: '', balance: 0 });
      setIsCreating(false);
    }
  };

  const handleUpdateAccount = async () => {
    if (editAccount.value?.trim()) {
      await dispatch(updateAccount(editAccount));
      setEditingId(null);
      setEditAccount({ id: 0, value: '', balance: 0 });
    }
  };

  const handleDeleteAccount = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
      await dispatch(deleteAccount(id));
    }
  };

  const startEditing = (account: Account) => {
    setEditingId(account.id);
    setEditAccount({
      id: account.id,
      value: account.value,
      balance: account.balance || 0,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditAccount({ id: 0, value: '', balance: 0 });
  };

  const cancelCreating = () => {
    setIsCreating(false);
    setNewAccount({ value: '', balance: 0 });
  };

  const getAccountIcon = (accountName: string) => {
    const name = accountName.toLowerCase();
    if (name.includes('saving')) return accountIcons.savings;
    if (name.includes('checking') || name.includes('current')) return accountIcons.checking;
    if (name.includes('credit')) return accountIcons.credit;
    if (name.includes('investment') || name.includes('mutual') || name.includes('stock'))
      return accountIcons.investment;
    if (name.includes('cash') || name.includes('wallet')) return accountIcons.cash;
    return accountIcons.default;
  };

  const getTotalBalance = () => {
    return accounts.reduce((total, account) => total + (account.balance || 0), 0);
  };

  const statCards: StatCard[] = [
    {
      label: 'Total Accounts',
      value: accounts.length,
      icon: Wallet,
      iconColor: 'text-blue-400',
      iconBgColor: 'bg-blue-500/20',
    },
    {
      label: 'Total Balance',
      value: <CurrencyDisplay amount={getTotalBalance()} />,
      icon: DollarSign,
      iconColor: 'text-green-400',
      iconBgColor: 'bg-green-500/20',
      valueColor: getTotalBalance() >= 0 ? 'text-green-400' : 'text-red-400',
    },
  ];

  return (
    <PageWrapper
      title="Account Management"
      subtitle="Manage your financial accounts and keep your balances in sync"
      statCards={statCards}
      headerActions={
        !isCreating ? (
          <Button onClick={() => setIsCreating(true)} leftIcon={<Plus className="h-4 w-4" />}>
            Add New Account
          </Button>
        ) : null
      }
    >
      {/* Create Account Form */}
      {isCreating && (
        <div className="glass-card rounded-lg p-6 border border-blue-500/30">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <Plus className="h-5 w-5 mr-2 text-blue-400" />
            Create New Account
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Account Name</label>
              <input
                type="text"
                placeholder="e.g., Savings Account, Checking Account"
                value={newAccount.value}
                onChange={(e) => setNewAccount({ ...newAccount, value: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Initial Balance</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newAccount.balance || 0}
                onChange={(e) => setNewAccount({ ...newAccount, balance: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex space-x-3 mt-4">
            <Button onClick={handleCreateAccount} leftIcon={<Save className="h-4 w-4" />}>
              Create Account
            </Button>
            <Button variant="outline" onClick={cancelCreating} leftIcon={<X className="h-4 w-4" />}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Accounts List */}
      <div className="space-y-3">
        {accounts.length === 0 ? (
          <div className="glass-card rounded-lg p-8 text-center">
            <Wallet className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Accounts Yet</h3>
            <p className="text-slate-400 mb-4">Create your first account to start tracking your balances</p>
            <Button onClick={() => setIsCreating(true)} leftIcon={<Plus className="h-4 w-4" />}>
              Add Your First Account
            </Button>
          </div>
        ) : (
          accounts.map((account) => {
            const IconComponent = getAccountIcon(account.value);
            const isEditing = editingId === account.id;

            return (
              <div
                key={account.id}
                className="glass-card rounded-lg p-4 hover:bg-slate-800/60 transition-colors border border-slate-700/50"
              >
                {isEditing ? (
                  /* Edit Mode */
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Account Name</label>
                        <input
                          type="text"
                          value={editAccount.value || ''}
                          onChange={(e) => setEditAccount({ ...editAccount, value: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Balance</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editAccount.balance || 0}
                          onChange={(e) => setEditAccount({ ...editAccount, balance: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button onClick={handleUpdateAccount} leftIcon={<Save className="h-4 w-4" />}>
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={cancelEditing} leftIcon={<X className="h-4 w-4" />}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-blue-400" />
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-white">{account.value}</h3>
                        <p className="text-sm text-slate-400">Account ID: {account.id}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-slate-400 mb-1">Balance</p>
                        <p
                          className={`text-lg font-semibold ${
                            (account.balance || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          <CurrencyDisplay amount={account.balance || 0} />
                        </p>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditing(account)}
                          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Edit Account"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAccount(account.id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete Account"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Help Text */}
      <div className="glass-card rounded-lg p-4 bg-slate-800/30 border border-slate-700/50">
        <h4 className="text-sm font-medium text-white mb-2">💡 Tips for Account Management</h4>
        <div className="text-xs text-slate-400 space-y-1">
          <p>• Create separate accounts for different purposes (savings, checking, credit cards)</p>
          <p>• Regularly update balances to keep your financial overview accurate</p>
          <p>• Use descriptive names like "Chase Checking" or "Emergency Savings"</p>
          <p>• Account balances are independent of your transaction history</p>
        </div>
      </div>
    </PageWrapper>
  );
};
