import { MdDeleteOutline } from 'react-icons/md';
import { ColumnMeta } from '../types';

export function Table<T>(props: { columnMeta: ColumnMeta[]; values: T[] }) {
  const { columnMeta = [], values = [], handleDelete, children } = props;
  return (
    <table className="w-full">
      <thead className="bg-[#4C5F6B]">
        <tr>
          {columnMeta.map(({ label }, i) => (
            <th key={i} className="py-2">
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {children}
        {values.map((v, i) => (
          <tr key={i}>
            {columnMeta.map(({ key }, i) => (
              <td key={i} className="py-1">
                {v[key]}
              </td>
            ))}
            <td onClick={() => handleDelete(v.id)}>
              <MdDeleteOutline size={24} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
