import { useMemo, useState } from 'react';
import { Category } from '../../types';
import { Modal } from '../ui/modal';
import { sqlite } from '../../config';

type CategoryTileProps = {
  active: boolean;
  emoji: string | undefined;
  label: string | undefined;
  onPress: () => void;
};

const CategoryTile = ({ active, emoji, label, onPress }: CategoryTileProps) => (
  <div className="cursor-pointer" onClick={onPress}>
    <div className="relative py-2 bg-slate-800 text-center rounded-xl">
      <p className="text-2xl">{emoji}</p>
      {active && <div className="absolute inset-0 rounded-xl ring-1 ring-white/70"></div>}
    </div>
    <p className="pt-1 text-[0.7rem] text-center truncate">{label}</p>
  </div>
);

export function CategoryPicker({
  value: cat,
  setValue,
  filter,
}: {
  value: Category | undefined;
  setValue: (v: Category) => void;
  filter?: string;
}) {
  const categories = useMemo(() => sqlite.categories.get<Category>(filter), []);
  const [showMore, setShowMore] = useState(false);
  // Handle date selection
  const handleCategoryClick = (cat: Category) => {
    setValue(cat);
    setShowMore(false);
  };
  return (
    <div>
      <div className="grid grid-cols-2 items-center mb-2">
        <div className="flex items-center gap-x-2">
          <label className="block text-sm font-medium text-slate-300">Category</label>
          <p className="text-xl">{cat?.emoji}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowMore(true)}
          className="p-2 text-slate-400 text-white bg-slate-700/50 rounded-lg transition-all duration-200"
        >
          <span>Show more</span>
        </button>
      </div>
      <div className="grid gap-1 grid-cols-4 grid-rows-2">
        {categories.slice(0, 8).map((c) => (
          <CategoryTile
            key={c.id}
            active={c.id === cat?.id}
            emoji={c.emoji}
            label={c.name}
            onPress={() => setValue(c)}
          />
        ))}
      </div>
      <Modal isOpen={showMore} onClose={() => setShowMore(false)} title="All Categories" size="md">
        <div className="grid gap-1 grid-cols-4">
          {categories.map((c) => (
            <CategoryTile
              key={c.id}
              active={c.id === cat?.id}
              emoji={c.emoji}
              label={c.name}
              onPress={() => handleCategoryClick(c)}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
}
