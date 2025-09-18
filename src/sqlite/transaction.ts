import { Table } from './table';
import { sqlite } from '../config';
import { CreateTransaction, SyncStatus, Transaction as TransactionTable, TransactionType } from '../types';

export class Transaction extends Table {
  static bulk(data: Array<CreateTransaction>) {
    data.forEach((ctxn) => {
      try {
        sqlite.db?.run(
          `
          INSERT INTO transactions (type, amount, account_id, category_id, note, date, transfer_account_id, counterparty, recurring_rule, parent_id, created_at, updated_at, deleted, sync_status)
          VALUES ($type, $amount, $account_id, $category_id, $note, $transfer_account_id, $counterparty, $recurring_rule, $parent_id, $created_at, $updated_at, $deleted, '${SyncStatus.pending}}')
        `,
          {
            $type: ctxn.type,
            $amount: ctxn.amount,
            $account_id: ctxn.account_id,
            $category_id: ctxn.category_id || null,
            $note: ctxn.note || null,
            $date: (ctxn.date || new Date()).toISOString(),
            $transfer_account_id: ctxn.transfer_account_id || null,
            $counterparty: ctxn.counterparty || null,
            $recurring_rule: ctxn.recurring_rule || null,
            $parent_id: ctxn.parent_id || null,
            $created_at: new Date().toISOString(),
            $updated_at: new Date().toISOString(),
            $deleted: 0,
          }
        );
      } catch (error) {
        console.log(ctxn);
        console.log('Error occurred while bulk inserting data: ', error);
      }
    });
    sqlite.saveDB();
  }

  static getByYearMonth(y: number, m: number): Array<TransactionTable> {
    const result = sqlite.transactions.retrieve(
      `
      SELECT
        t.id,
        t.date,
        t.type,
        t.amount,
        t.note,
        t.updated_at,
        t.deleted,
        t.sync_status,
        c.id AS category_id,
        c.name AS category__name,
        c.emoji AS category__emoji,
        a.id AS account_id,
        a.name AS account__name
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN accounts a ON t.account_id = a.id
      `,
      `strftime('%Y', date) = '${y}' AND strftime('%m', date) = '${String(m + 1).padStart(2, '0')}'`
    );
    return (result as unknown as Array<Record<string, string>>).map((t) => ({
      id: parseInt(t.id),
      date: new Date(t.date),
      type: t.type as TransactionType,
      amount: Number(t.amount),
      category_id: parseInt(t.category_id),
      category: {
        name: t.category__name,
        emoji: t.category__emoji,
      },
      account_id: parseInt(t.account_id),
      account: {
        name: t.account__name,
      },
      deleted: t.deleted === '0' ? false : true,
      sync_status: t.sync_status as SyncStatus,
      created_at: new Date(t.created_at),
      updated_at: new Date(t.updated_at),
    }));
  }
}
