import { useEffect, useState } from 'react';
import { ColumnMeta } from '../types';

export function TableEntry({ columnMeta = [], handleSubmit }: { columnMeta: ColumnMeta[] }) {
  const [value, setValue] = useState({});
  useEffect(() => {
    // Initialize with default value
    const v = {};
    columnMeta.forEach(({ key, type, defaultValue, ...rest }) => {
      if (type === 'picker') {
        v[key] = rest?.values?.[0]?.value;
      } else {
        v[key] = defaultValue;
      }
    });
    setValue(v);
  }, [columnMeta]);
  const handleKeyDown = (e: Event) => {
    if (e.code == 'Enter') {
      handleSubmit(value);
      e.preventDefault();
    }
  };
  return (
    <tr>
      {columnMeta.map(({ label, key, type, placeholder, ...rest }, i) => (
        <th key={i} className="border">
          {type == 'picker' ? (
            <select
              onChange={(e) =>
                setValue((prev) => {
                  const changed = { ...prev };
                  changed[key] = e.target.value;
                  return changed;
                })
              }
            >
              {rest?.values.map(({ label, value }) => <option value={value}>{label}</option>)}
            </select>
          ) : (
            <input
              placeholder={placeholder || label}
              value={value[key]}
              onChange={(e) =>
                setValue((prev) => {
                  const changed = { ...prev };
                  changed[key] = e.target.value;
                  return changed;
                })
              }
              onKeyDown={handleKeyDown}
              className="w-full text-end"
            />
          )}
        </th>
      ))}
    </tr>
  );
}
