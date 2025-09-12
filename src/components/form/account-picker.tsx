import { useSelector } from 'react-redux';
import { RootState } from '../../store/index.types';

export function AccountPicker({
  label,
  error,
  value,
  setValue,
}: {
  label: string;
  error: boolean;
  value: number | undefined;
  setValue: (v: number) => void;
}) {
  const { accounts } = useSelector((state: RootState) => state.transactions);
  return (
    <div className="grid grid-cols-2 items-center">
      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      <select
        className={`w-full px-4 py-2 bg-slate-700/50 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? 'border-red-500/50' : 'border-slate-600/50'
        }`}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      >
        {accounts.map(({ id, value }) => (
          <option key={id} value={id} className="bg-slate-800">
            {value}
          </option>
        ))}
      </select>
    </div>
  );
}
