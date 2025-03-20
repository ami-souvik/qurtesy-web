import { ColumnMeta } from '../types';

export function TableEntry({ columnMeta = [] }: { columnMeta: ColumnMeta[] }) {
  return (
    <tr>
      {columnMeta.map(({ label, placeholder, defaultValue }, i) => (
        <th key={i} className="border">
          <input placeholder={placeholder || label} value={defaultValue} className="w-full text-end" />
        </th>
      ))}
    </tr>
  );
}
