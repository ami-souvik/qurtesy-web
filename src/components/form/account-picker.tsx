import { sqlite } from '../../config';
import { Account } from '../../types';

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
  const accounts = sqlite.accounts.get<Account>();
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
        {accounts.map(({ id, name }) => (
          <option key={id} value={id} className="bg-slate-800">
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
