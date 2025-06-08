import { useEffect, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import { FaRegSmile } from 'react-icons/fa';
import {
  IoPeopleOutline,
  IoFastFoodOutline,
  IoBusOutline,
  IoBalloonOutline,
  IoShirtOutline,
  IoMusicalNotesOutline,
  IoFlagOutline,
} from 'react-icons/io5';
import { PiDogBold } from 'react-icons/pi';
import { RiEmojiStickerLine } from 'react-icons/ri';
import { IconType } from 'react-icons/lib';
import { emojis } from './emojis';

const cats: { [k: string]: IconType } = {
  'Smileys & Emotion': FaRegSmile,
  'People & Body': IoPeopleOutline,
  'Animals & Nature': PiDogBold,
  'Food & Drink': IoFastFoodOutline,
  'Travel & Places': IoBusOutline,
  Activities: IoBalloonOutline,
  Objects: IoShirtOutline,
  Symbols: IoMusicalNotesOutline,
  Flags: IoFlagOutline,
};

export function EmojiPicker({ name, control }: { name: string; control: unknown }) {
  const modalRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [category, setCategory] = useState('Smileys & Emotion');
  const close = () => setVisible(false);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        close();
      }
    };
    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible]);
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: true,
      }}
      render={({ field: { onChange, value } }) => (
        <div>
          <div
            className="flex justify-center w-full border border-[#687384] rounded px-1 cursor-pointer text-2xl"
            onClick={() => setVisible(true)}
          >
            {value || <RiEmojiStickerLine size={24} />}
          </div>
          <div ref={modalRef} className="relative">
            {visible && (
              <div className="absolute top-0 translate-x-[-25%] bg-black border border-[#687384] rounded-md top-3 p-2">
                <div className="flex items-center gap-2 pb-2 border-b border-[#687384]">
                  {Object.keys(emojis).map((cat) => {
                    const Category = cats[cat];
                    return (
                      <div
                        className="p-1 cursor-pointer rounded-xl"
                        style={{
                          backgroundColor: category === cat ? '#687384' : undefined,
                        }}
                        onClick={() => setCategory(cat)}
                      >
                        <Category size={16} />
                      </div>
                    );
                  })}
                </div>
                <div className="py-2">
                  <p>{category}</p>
                </div>
                <div className="h-[16rem] flex flex-wrap gap-2 overflow-auto">
                  {Object.values(emojis[category]).map((array) =>
                    array.map((v) => (
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          onChange(v.emoji);
                          close();
                        }}
                      >
                        <p className="text-2xl">{v.emoji}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    />
  );
}
