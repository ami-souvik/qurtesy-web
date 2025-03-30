import { CategoryForm, AccountForm } from '../form';

export function TabHead() {
  return (
    <div className="px-1 py-2 grid grid-cols-[1fr_1fr_1fr_1fr_24px_24px] bg-[#1e2329] rounded-md">
      <div className="flex items-center">
        <p className="text-xs font-bold">Date</p>
      </div>
      <div className="flex items-center">
        <p className="text-xs font-bold">Amount</p>
      </div>
      <div className="flex items-center">
        <p className="text-xs font-bold">Category</p>
        <CategoryForm />
      </div>
      <div className="flex items-center">
        <p className="text-xs font-bold">Account</p>
        <AccountForm />
      </div>
      <div></div>
      <div></div>
    </div>
  );
}
