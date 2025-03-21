import { TableEntry } from '../form/table-entry';
import { ColumnMeta } from '../types';
import { MdDeleteOutline } from 'react-icons/md';

export function Table<T>(props: { columnMeta: ColumnMeta[]; values: T[] }) {
  const { columnMeta = [], values = [], handleDelete } = props;
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
        <TableEntry {...props} />
      </tbody>
    </table>
  );
}
