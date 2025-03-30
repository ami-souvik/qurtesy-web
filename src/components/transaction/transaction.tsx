import { MdEdit, MdDeleteOutline } from 'react-icons/md';
import { type Transaction as TransactionType } from '../../types';
import { TransactionFormProps } from '../form/transaction-form';

export function Transaction({
  data,
  handleSelect,
  handleDelete,
}: {
  data: TransactionType;
  handleSelect: (v: TransactionFormProps) => void;
  handleDelete: (id: number) => void;
}) {
  return (
    <div className="gap-2 grid grid-cols-[1fr_1fr_1fr_1fr_24px_24px] border-[#20242a] border-b">
      <p className="m-1 text-right">{String(data.date)}</p>
      <p className="m-1 text-right">₹ {data.amount}</p>
      <div>
        <p className="m-1">
          {data.category_group?.emoji} {data.category_group.value}
        </p>
        <p className="m-1 pl-2 border-l-2 italic">
          {data.category?.emoji} {data.category.value}
        </p>
      </div>
      <div>
        <p className="m-1">{data.account_group.value}</p>
        <p className="m-1 pl-2 border-l-2 italic">{data.account.value}</p>
      </div>
      <button
        className="h-full px-1 flex items-center"
        onClick={() =>
          handleSelect({
            id: data.id,
            date: new Date(
              Number(data.date.substring(6, 10)),
              Number(data.date.substring(3, 5)) - 1,
              Number(data.date.substring(0, 2))
            ),
            amount: data.amount,
            category: data.category.id,
            account: data.account.id,
            note: data.note,
          })
        }
      >
        <MdEdit size={18} />
      </button>
      <button onClick={() => handleDelete(data.id)}>
        <MdDeleteOutline size={24} />
      </button>
      {data.note && <p className="m-1 px-2 rounded-md text-right col-span-2 italic bg-[#fff1]">{data.note}</p>}
    </div>
  );
}
