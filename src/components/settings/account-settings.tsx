import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store.types';
import {
  fetchAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
  fetchProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  setSection,
} from '../../slices/daily-expenses-slice';
import {
  Account,
  CreateAccount,
  UpdateAccount,
  Profile,
  CreateProfile,
  UpdateProfile,
  Category,
  CreateCategory,
  UpdateCategory,
  Section,
} from '../../types/daily-expenses';
import { CurrencyDisplay } from '../currency';
import { Button } from '../action/button';
import { PageWrapper } from '../layout';
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
  Users,
  Tag,
  ArrowUpCircle,
  ArrowDownCircle,
  User,
} from 'lucide-react';

const accountIcons = {
  savings: PiggyBank,
  checking: Building2,
  credit: CreditCard,
  investment: Landmark,
  cash: Wallet,
  default: DollarSign,
};

type TabType = 'accounts' | 'participants' | 'income-categories' | 'expense-categories';

export const AccountSettings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const accounts = useSelector((state: RootState) => state.dailyExpenses.accounts);
  const profiles = useSelector((state: RootState) => state.dailyExpenses.profiles);
  const categories = useSelector((state: RootState) => state.dailyExpenses.categories);

  const [activeTab, setActiveTab] = useState<TabType>('accounts');

  // Account state
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState<number | null>(null);
  const [newAccount, setNewAccount] = useState<CreateAccount>({ value: '', balance: 0 });
  const [editAccount, setEditAccount] = useState<UpdateAccount>({ id: 0, value: '', balance: 0 });

  // Profile state
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<number | null>(null);
  const [newProfile, setNewProfile] = useState<CreateProfile>({ name: '', email: '', phone: '' });
  const [editProfile, setEditProfile] = useState<UpdateProfile>({ id: 0, name: '', email: '', phone: '' });

  // Category state
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState<CreateCategory>({ value: '', emoji: '' });
  const [editCategory, setEditCategory] = useState<UpdateCategory>({ id: 0, value: '', emoji: '' });

  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchProfiles());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Sync Redux section state with active tab
  useEffect(() => {
    if (activeTab === 'income-categories') {
      dispatch(setSection('INCOME'));
    } else if (activeTab === 'expense-categories') {
      dispatch(setSection('EXPENSE'));
    }
  }, [activeTab, dispatch]);

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
    if (newAccount.value.trim()) {
      await dispatch(createAccount(newAccount));
      setNewAccount({ value: '', balance: 0 });
      setIsCreatingAccount(false);
    }
  };

  const handleUpdateAccount = async () => {
    if (editAccount.value?.trim()) {
      await dispatch(updateAccount(editAccount));
      setEditingAccountId(null);
      setEditAccount({ id: 0, value: '', balance: 0 });
    }
  };

  const handleDeleteAccount = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
      await dispatch(deleteAccount(id));
    }
  };

  const startEditingAccount = (account: Account) => {
    setEditingAccountId(account.id);
    setEditAccount({
      id: account.id,
      value: account.value,
      balance: account.balance || 0,
    });
  };

  // Profile handlers
  const handleCreateProfile = async () => {
    if (newProfile.name.trim()) {
      await dispatch(createProfile(newProfile));
      setNewProfile({ name: '', email: '', phone: '' });
      setIsCreatingProfile(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (editProfile.name?.trim()) {
      await dispatch(updateProfile(editProfile));
      setEditingProfileId(null);
      setEditProfile({ id: 0, name: '', email: '', phone: '' });
    }
  };

  const handleDeleteProfile = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this participant? This action cannot be undone.')) {
      await dispatch(deleteProfile(id));
    }
  };

  const startEditingProfile = (profile: Profile) => {
    setEditingProfileId(profile.id);
    setEditProfile({
      id: profile.id,
      name: profile.name,
      email: profile.email || '',
      phone: profile.phone || '',
    });
  };

  // Category handlers
  const handleCreateCategory = async () => {
    if (newCategory.value.trim()) {
      await dispatch(createCategory(newCategory));
      setNewCategory({ value: '', emoji: '' });
      setIsCreatingCategory(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (editCategory.value?.trim()) {
      await dispatch(updateCategory(editCategory));
      setEditingCategoryId(null);
      setEditCategory({ id: 0, value: '', emoji: '' });
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      await dispatch(deleteCategory(id));
    }
  };

  const startEditingCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditCategory({
      id: category.id,
      value: category.value,
      emoji: category.emoji || '',
    });
  };

  const getFilteredCategories = (section: Section) => {
    return categories.filter((cat) => cat.section === section);
  };

  const renderTabButtons = () => (
    <div className="flex space-x-1 mb-6 bg-slate-800/30 p-1 rounded-lg">
      <button
        onClick={() => setActiveTab('accounts')}
        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          activeTab === 'accounts' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
        }`}
      >
        <Wallet className="h-4 w-4 inline mr-2" />
        Accounts
      </button>
      <button
        onClick={() => setActiveTab('participants')}
        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          activeTab === 'participants'
            ? 'bg-blue-600 text-white'
            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
        }`}
      >
        <Users className="h-4 w-4 inline mr-2" />
        Participants
      </button>
      <button
        onClick={() => {
          setActiveTab('income-categories');
          dispatch(setSection('INCOME'));
        }}
        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          activeTab === 'income-categories'
            ? 'bg-green-600 text-white'
            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
        }`}
      >
        <ArrowUpCircle className="h-4 w-4 inline mr-2" />
        Income Categories
      </button>
      <button
        onClick={() => {
          setActiveTab('expense-categories');
          dispatch(setSection('EXPENSE'));
        }}
        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          activeTab === 'expense-categories'
            ? 'bg-red-600 text-white'
            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
        }`}
      >
        <ArrowDownCircle className="h-4 w-4 inline mr-2" />
        Expense Categories
      </button>
    </div>
  );

  return (
    <PageWrapper title="Data Management" subtitle="Manage your accounts, participants, and transaction categories">
      {renderTabButtons()}
      {activeTab === 'accounts' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Accounts</h2>
            {!isCreatingAccount && (
              <Button onClick={() => setIsCreatingAccount(true)} leftIcon={<Plus className="h-4 w-4" />}>
                Add Account
              </Button>
            )}
          </div>

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
                <Button
                  variant="outline"
                  onClick={() => setIsCreatingAccount(false)}
                  leftIcon={<X className="h-4 w-4" />}
                >
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
                <Button onClick={() => setIsCreatingAccount(true)} leftIcon={<Plus className="h-4 w-4" />}>
                  Add Your First Account
                </Button>
              </div>
            ) : (
              accounts.map((account) => {
                const IconComponent = getAccountIcon(account.value);
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
                              onChange={(e) =>
                                setEditAccount({ ...editAccount, balance: parseFloat(e.target.value) || 0 })
                              }
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
                            <h3 className="text-lg font-medium text-white">{account.value}</h3>
                            <p className="text-sm text-slate-400">Account ID: {account.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-xs text-slate-400 mb-1">Balance</p>
                            <p
                              className={`text-lg font-semibold ${(account.balance || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}
                            >
                              <CurrencyDisplay amount={account.balance || 0} />
                            </p>
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
      )}

      {activeTab === 'participants' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Participants</h2>
            {!isCreatingProfile && (
              <Button onClick={() => setIsCreatingProfile(true)} leftIcon={<Plus className="h-4 w-4" />}>
                Add Participant
              </Button>
            )}
          </div>

          {/* Create Profile Form */}
          {isCreatingProfile && (
            <div className="glass-card rounded-lg p-6 border border-green-500/30">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                <Plus className="h-5 w-5 mr-2 text-green-400" />
                Add New Participant
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Name *</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newProfile.name}
                    onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={newProfile.email || ''}
                    onChange={(e) => setNewProfile({ ...newProfile, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 123-4567"
                    value={newProfile.phone || ''}
                    onChange={(e) => setNewProfile({ ...newProfile, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-4">
                <Button onClick={handleCreateProfile} leftIcon={<Save className="h-4 w-4" />}>
                  Add Participant
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsCreatingProfile(false)}
                  leftIcon={<X className="h-4 w-4" />}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Participants List */}
          <div className="space-y-3">
            {profiles.length === 0 ? (
              <div className="glass-card rounded-lg p-8 text-center">
                <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No Participants Yet</h3>
                <p className="text-slate-400 mb-4">Add participants for split expenses and lending</p>
                <Button onClick={() => setIsCreatingProfile(true)} leftIcon={<Plus className="h-4 w-4" />}>
                  Add Your First Participant
                </Button>
              </div>
            ) : (
              profiles.map((profile) => {
                const isEditing = editingProfileId === profile.id;

                return (
                  <div
                    key={profile.id}
                    className="glass-card rounded-lg p-4 hover:bg-slate-800/60 transition-colors border border-slate-700/50"
                  >
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                            <input
                              type="text"
                              value={editProfile.name || ''}
                              onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                            <input
                              type="email"
                              value={editProfile.email || ''}
                              onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                            <input
                              type="text"
                              value={editProfile.phone || ''}
                              onChange={(e) => setEditProfile({ ...editProfile, phone: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <Button onClick={handleUpdateProfile} leftIcon={<Save className="h-4 w-4" />}>
                            Save Changes
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setEditingProfileId(null)}
                            leftIcon={<X className="h-4 w-4" />}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <User className="h-6 w-6 text-green-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-white flex items-center">
                              {profile.name}
                              {profile.is_self && (
                                <span className="ml-2 px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                                  You
                                </span>
                              )}
                            </h3>
                            <div className="text-sm text-slate-400">
                              {profile.email && <p>📧 {profile.email}</p>}
                              {profile.phone && <p>📱 {profile.phone}</p>}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditingProfile(profile)}
                            className="p-2 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                            title="Edit Participant"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          {!profile.is_self && (
                            <button
                              onClick={() => handleDeleteProfile(profile.id)}
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Delete Participant"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {(activeTab === 'income-categories' || activeTab === 'expense-categories') && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">
              {activeTab === 'income-categories' ? 'Income Categories' : 'Expense Categories'}
            </h2>
            {!isCreatingCategory && (
              <Button onClick={() => setIsCreatingCategory(true)} leftIcon={<Plus className="h-4 w-4" />}>
                Add Category
              </Button>
            )}
          </div>

          {/* Create Category Form */}
          {isCreatingCategory && (
            <div
              className={`glass-card rounded-lg p-6 border ${
                activeTab === 'income-categories' ? 'border-green-500/30' : 'border-red-500/30'
              }`}
            >
              <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                <Plus
                  className={`h-5 w-5 mr-2 ${activeTab === 'income-categories' ? 'text-green-400' : 'text-red-400'}`}
                />
                Add New {activeTab === 'income-categories' ? 'Income' : 'Expense'} Category
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Category Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Salary, Food, Transportation"
                    value={newCategory.value}
                    onChange={(e) => setNewCategory({ ...newCategory, value: e.target.value })}
                    className={`w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                      activeTab === 'income-categories' ? 'focus:ring-green-500' : 'focus:ring-red-500'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Emoji (Optional)</label>
                  <input
                    type="text"
                    placeholder="🏠 💰 🍔"
                    maxLength={2}
                    value={newCategory.emoji || ''}
                    onChange={(e) => setNewCategory({ ...newCategory, emoji: e.target.value })}
                    className={`w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                      activeTab === 'income-categories' ? 'focus:ring-green-500' : 'focus:ring-red-500'
                    }`}
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-4">
                <Button onClick={handleCreateCategory} leftIcon={<Save className="h-4 w-4" />}>
                  Add Category
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsCreatingCategory(false)}
                  leftIcon={<X className="h-4 w-4" />}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Categories List */}
          <div className="space-y-3">
            {(() => {
              const filteredCategories = getFilteredCategories(
                activeTab === 'income-categories' ? 'INCOME' : 'EXPENSE'
              );

              if (filteredCategories.length === 0) {
                return (
                  <div className="glass-card rounded-lg p-8 text-center">
                    <Tag className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      No {activeTab === 'income-categories' ? 'Income' : 'Expense'} Categories Yet
                    </h3>
                    <p className="text-slate-400 mb-4">
                      Create categories to organize your {activeTab === 'income-categories' ? 'income' : 'expenses'}
                    </p>
                    <Button onClick={() => setIsCreatingCategory(true)} leftIcon={<Plus className="h-4 w-4" />}>
                      Add Your First Category
                    </Button>
                  </div>
                );
              }

              return filteredCategories.map((category) => {
                const isEditing = editingCategoryId === category.id;

                return (
                  <div
                    key={category.id}
                    className="glass-card rounded-lg p-4 hover:bg-slate-800/60 transition-colors border border-slate-700/50"
                  >
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Category Name</label>
                            <input
                              type="text"
                              value={editCategory.value || ''}
                              onChange={(e) => setEditCategory({ ...editCategory, value: e.target.value })}
                              className={`w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-transparent ${
                                activeTab === 'income-categories' ? 'focus:ring-green-500' : 'focus:ring-red-500'
                              }`}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Emoji</label>
                            <input
                              type="text"
                              maxLength={2}
                              value={editCategory.emoji || ''}
                              onChange={(e) => setEditCategory({ ...editCategory, emoji: e.target.value })}
                              className={`w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-transparent ${
                                activeTab === 'income-categories' ? 'focus:ring-green-500' : 'focus:ring-red-500'
                              }`}
                            />
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <Button onClick={handleUpdateCategory} leftIcon={<Save className="h-4 w-4" />}>
                            Save Changes
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setEditingCategoryId(null)}
                            leftIcon={<X className="h-4 w-4" />}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              activeTab === 'income-categories' ? 'bg-green-500/20' : 'bg-red-500/20'
                            }`}
                          >
                            {category.emoji ? (
                              <span className="text-2xl">{category.emoji}</span>
                            ) : (
                              <Tag
                                className={`h-6 w-6 ${
                                  activeTab === 'income-categories' ? 'text-green-400' : 'text-red-400'
                                }`}
                              />
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-white">{category.value}</h3>
                            <p className="text-sm text-slate-400">
                              {category.section} • Category ID: {category.id}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditingCategory(category)}
                            className={`p-2 text-slate-400 rounded-lg transition-colors ${
                              activeTab === 'income-categories'
                                ? 'hover:text-green-400 hover:bg-green-500/10'
                                : 'hover:text-red-400 hover:bg-red-500/10'
                            }`}
                            title="Edit Category"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete Category"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}
    </PageWrapper>
  );
};
