import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { MdEdit, MdDeleteOutline } from 'react-icons/md';
import { AppDispatch, RootState } from '../store.types';
import { Category, CreateCategory, UpdateCategory } from '../types/daily-expenses';
import { createCategory, updateCategory, deleteCategory } from '../slices/daily-expenses-slice';
import { EmojiPicker } from './form/emoji-picker';

export function CategoryForm() {
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
  const { categories } = useSelector((state: RootState) => state.dailyExpenses);
  const { register, handleSubmit, control, reset, setValue } = useForm<CreateCategory | UpdateCategory>();
  const add = () => {
    reset({
      id: null,
      emoji: null,
      value: null,
    });
  };
  const onSubmit = (data: CreateCategory | UpdateCategory) => {
    if (data?.id) {
      dispatch(updateCategory(data));
    } else {
      dispatch(createCategory(data));
    }
  };
  const handleDelete = (id: number) => {
    if (confirm('Do you want to delete this category?')) dispatch(deleteCategory(id));
  };
  return (
    <div>
      <button className="h-full px-1 flex items-center" onClick={() => setVisible(true)}>
        <MdEdit size={18} />
      </button>
      <div ref={modalRef} className="relative">
        {visible && (
          <div className="absolute top-0 w-lg translate-x-[-50%] border border-[#687384] rounded-md top-3 bg-black px-4 py-2">
            <div className="grid grid-cols-[1.5fr_1fr]">
              <div className="flex flex-col gap-2 border-r border-[#687384] pr-2 mr-2">
                {categories.map((c: Category, i: number) => (
                  <div
                    className="flex justify-between border-[#20242a]"
                    style={{
                      borderBottomWidth: categories.length - 1 != i ? 1 : 0,
                    }}
                  >
                    <div
                      key={i}
                      className="w-full cursor-pointer"
                      onClick={() => {
                        setValue('id', c.id);
                        setValue('emoji', c.emoji);
                        setValue('value', c.value);
                      }}
                    >
                      <p>
                        {c.emoji} {c.value}
                      </p>
                    </div>
                    <button onClick={() => handleDelete(c.id)}>
                      <MdDeleteOutline size={18} />
                    </button>
                  </div>
                ))}
                <button className="border rounded px-2" onClick={add}>
                  Add
                </button>
              </div>
              <form>
                <div className="flex flex-col">
                  <div>
                    <p>Emoji</p>
                    <EmojiPicker {...{ name: 'emoji', control }} />
                  </div>
                  <div>
                    <p>Value</p>
                    <input className="w-full border border-[#687384] rounded px-1" {...register('value')} />
                  </div>
                  <button className="border rounded px-2 mt-2" onClick={handleSubmit(onSubmit)}>
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
