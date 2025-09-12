import { forwardRef, useImperativeHandle, useState } from 'react';
import {
  Edit2,
  Plus,
  Save,
  Trash2,
  Wallet,
  X,
  DollarSign,
  Building2,
  CreditCard,
  Landmark,
  PiggyBank,
} from 'lucide-react';
import { Button } from '../action/button';
import { CurrencyDisplay } from '../currency';
import { Account as AccountType, CreateAccount, UpdateAccount } from '../../types';
import { Account } from '../../sqlite/account';

const accountIcons = {
  savings: PiggyBank,
  checking: Building2,
  credit: CreditCard,
  investment: Landmark,
  cash: Wallet,
  default: DollarSign,
};

export const Accounts = forwardRef(function Accounts(_props, ref) {
  const accounts: Array<AccountType> = Account.get();
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState<number | null>(null);
  const [editAccount, setEditAccount] = useState<UpdateAccount>({ id: 0, name: '', balance: 0 });
  const [newAccount, setNewAccount] = useState<CreateAccount>({ name: '', balance: 0 });

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

  // Account handlers
  const handleCreateAccount = async () => {
    if (newAccount.name.trim()) {
      Account.create(newAccount);
      setNewAccount({ name: '', balance: 0 });
      setIsCreatingAccount(false);
    }
  };
  const handleUpdateAccount = async () => {
    if (editAccount.name?.trim()) {
      Account.update(editAccount);
      setEditingAccountId(null);
      setEditAccount({ id: 0, name: '', balance: 0 });
    }
  };
  const handleDeleteAccount = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
      Account.delete(id);
    }
  };
  const startEditingAccount = (account: Account) => {
    setEditingAccountId(account.id);
    setEditAccount({
      id: account.id,
      name: account.name,
      balance: account.balance || 0,
    });
  };
  const handleAdd = () => {
    setIsCreatingAccount(true);
  };
  useImperativeHandle(ref, () => ({
    handleAdd,
  }));
  return (
    <div className="space-y-6">
      {/* Create Account Form */}
      {isCreatingAccount && (
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
                value={newAccount.name}
                onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
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
            <Button variant="outline" onClick={() => setIsCreatingAccount(false)} leftIcon={<X className="h-4 w-4" />}>
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
            <Button onClick={handleAdd} leftIcon={<Plus className="h-4 w-4" />}>
              Add Your First Account
            </Button>
          </div>
        ) : (
          accounts.map((account) => {
            const IconComponent = getAccountIcon(account.name);
            const isEditing = editingAccountId === account.id;

            return (
              <div
                key={account.id}
                className="glass-card rounded-lg p-4 hover:bg-slate-800/60 transition-colors border border-slate-700/50"
              >
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Account Name</label>
                        <input
                          type="text"
                          value={editAccount.name || ''}
                          onChange={(e) => setEditAccount({ ...editAccount, name: e.target.value })}
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
                      <Button
                        variant="outline"
                        onClick={() => setEditingAccountId(null)}
                        leftIcon={<X className="h-4 w-4" />}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white">{account.name}</h3>
                        <p className="text-xs text-slate-400">Account ID: {account.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-xs text-slate-400 mb-1">Balance</p>
                        <CurrencyDisplay
                          className={`text-lg font-semibold ${(account.balance || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}
                          amount={account.balance || 0}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditingAccount(account)}
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
    </div>
  );
});
