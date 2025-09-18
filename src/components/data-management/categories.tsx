import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Edit2, Plus, Save, Tag, Trash2, X } from 'lucide-react';
import { TabHandle } from '../tabs';
import { Button } from '../action/button';
import { sqlite } from '../../config';
import { Category, CategoryType, CreateCategory, UpdateCategory } from '../../types';

export type CategoriesProps = {
  name: string;
};

export const Categories = forwardRef<TabHandle, CategoriesProps>(function Categories(_props, ref) {
  const { name } = _props;
  const categories: Array<Category> = sqlite.categories.get<Category>();

  // Category state
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState<CreateCategory>({
    name: '',
    emoji: '',
    type: name === 'INCOME_CATEGORY' ? CategoryType.income : CategoryType.expense,
  });
  const [editCategory, setEditCategory] = useState<UpdateCategory>({
    id: 0,
    name: '',
    emoji: '',
    type: name === 'INCOME_CATEGORY' ? CategoryType.income : CategoryType.expense,
  });

  // Category handlers
  const addCategory = async () => {
    if (newCategory.name.trim()) {
      sqlite.categories.create(newCategory);
      setNewCategory({
        name: '',
        emoji: '',
        type: name === 'INCOME_CATEGORY' ? CategoryType.income : CategoryType.expense,
      });
      setIsCreatingCategory(false);
    }
  };
  const updateCategory = async () => {
    if (editCategory.name?.trim()) {
      sqlite.categories.update(editCategory);
      setEditingCategoryId(null);
      setEditCategory({ id: 0, name: '', emoji: '' });
    }
  };
  const deleteCategory = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      sqlite.categories.delete(id);
    }
  };
  const startEditingCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditCategory({
      id: category.id,
      name: category.name,
      emoji: category.emoji || '',
    });
  };
  const getFilteredCategories = (name: string) => {
    const type = name === 'INCOME_CATEGORY' ? 'income' : 'expense';
    return categories.filter((cat) => cat.type === type);
  };
  const handleAdd = () => {
    setIsCreatingCategory(true);
  };
  useImperativeHandle(ref, () => ({
    handleAdd,
  }));
  useEffect(() => {
    setIsCreatingCategory(false);
    setEditingCategoryId(null);
    setNewCategory({
      name: '',
      emoji: '',
      type: name === 'INCOME_CATEGORY' ? CategoryType.income : CategoryType.expense,
    });
    setEditCategory({
      id: 0,
      name: '',
      emoji: '',
      type: name === 'INCOME_CATEGORY' ? CategoryType.income : CategoryType.expense,
    });
  }, [name]);
  return (
    <div className="space-y-6">
      {/* Create Category Form */}
      {isCreatingCategory && (
        <div
          className={`glass-card rounded-lg p-6 border ${
            name === 'INCOME_CATEGORY' ? 'border-green-500/30' : 'border-red-500/30'
          }`}
        >
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <Plus className={`h-5 w-5 mr-2 ${name === 'INCOME_CATEGORY' ? 'text-green-400' : 'text-red-400'}`} />
            Add New {name === 'INCOME_CATEGORY' ? 'Income' : 'Expense'} Category
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category Name</label>
              <input
                type="text"
                placeholder="e.g., Salary, Food, Transportation"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className={`w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                  name === 'INCOME_CATEGORY' ? 'focus:ring-green-500' : 'focus:ring-red-500'
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
                  name === 'INCOME_CATEGORY' ? 'focus:ring-green-500' : 'focus:ring-red-500'
                }`}
              />
            </div>
          </div>
          <div className="flex space-x-3 mt-4">
            <Button onClick={addCategory} leftIcon={<Save className="h-4 w-4" />}>
              Add Category
            </Button>
            <Button variant="outline" onClick={() => setIsCreatingCategory(false)} leftIcon={<X className="h-4 w-4" />}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-3">
        {(() => {
          const filteredCategories = getFilteredCategories(name);
          if (filteredCategories.length === 0) {
            return (
              <div className="glass-card rounded-lg p-8 text-center">
                <Tag className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  No {name === 'INCOME_CATEGORY' ? 'Income' : 'Expense'} Categories Yet
                </h3>
                <p className="text-slate-400 mb-4">
                  Create categories to organize your {name === 'INCOME_CATEGORY' ? 'income' : 'expenses'}
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
                          value={editCategory.name || ''}
                          onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                          className={`w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-transparent ${
                            name === 'INCOME_CATEGORY' ? 'focus:ring-green-500' : 'focus:ring-red-500'
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
                            name === 'INCOME_CATEGORY' ? 'focus:ring-green-500' : 'focus:ring-red-500'
                          }`}
                        />
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <Button onClick={updateCategory} leftIcon={<Save className="h-4 w-4" />}>
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
                          name === 'INCOME_CATEGORY' ? 'bg-green-500/20' : 'bg-red-500/20'
                        }`}
                      >
                        {category.emoji ? (
                          <span className="text-2xl">{category.emoji}</span>
                        ) : (
                          <Tag
                            className={`h-6 w-6 ${name === 'INCOME_CATEGORY' ? 'text-green-400' : 'text-red-400'}`}
                          />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white">{category.name}</h3>
                        <p className="text-xs text-slate-400">
                          {category.type} • Category ID: {category.id}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditingCategory(category)}
                        className={`p-2 text-slate-400 rounded-lg transition-colors ${
                          name === 'INCOME_CATEGORY'
                            ? 'hover:text-green-400 hover:bg-green-500/10'
                            : 'hover:text-red-400 hover:bg-red-500/10'
                        }`}
                        title="Edit Category"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteCategory(category.id)}
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
  );
});
