import { TableEntry } from '../form/table-entry';
import { ColumnMeta } from '../types';

export function Table<T>({ columnMeta = [], values = [] }: { columnMeta: ColumnMeta[]; values: T[] }) {
  return (
    <table>
      <thead>
        <tr>
          {columnMeta.map(({ label }, i) => (
            <th key={i} className="border">
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {values.map((v, i) => (
          <tr key={i}>
            {columnMeta.map(({ key }, i) => (
              <td key={i} className="border">
                {v[key]}
              </td>
            ))}
          </tr>
        ))}
        <TableEntry columnMeta={columnMeta} />
      </tbody>
    </table>
  );
}
