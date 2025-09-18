import { Table } from './table';
import { sqlite } from '../config';
import { SyncStatus, CreateTransfer } from '../types';

export class Transfer extends Table {
  static create(ctxn: CreateTransfer): number | null {
    let lastId = null;
    try {
      sqlite.db?.run(
        `
        INSERT INTO transactions (type, amount, account_id, note, date, transfer_account_id, created_at, updated_at, deleted, sync_status)
        VALUES ('transfer', $amount, $account_id, $note, $date, $transfer_account_id, $created_at, $updated_at, $deleted, '${SyncStatus.pending}')
      `,
        {
          $amount: ctxn.amount,
          $account_id: ctxn.account_id,
          $note: ctxn.note ?? null,
          $date: ctxn.date ? ctxn.date.toISOString() : new Date().toISOString(),
          $transfer_account_id: ctxn.transfer_account_id || null,
          $created_at: new Date().toISOString(),
          $updated_at: new Date().toISOString(),
          $deleted: 0,
        }
      );
      lastId = Number(sqlite.db?.exec('SELECT last_insert_rowid() as id')[0].values[0][0]);
      sqlite.saveDB();
    } catch (error) {
      console.log('Error occurred while inserting Transfer: ', error);
    }
    return lastId;
  }

  static delete(id: number) {
    try {
      sqlite.db?.run(
        `UPDATE transactions
        SET deleted = 1,
            updated_at = $updated_at,
            sync_status = '${SyncStatus.pending}'
        WHERE id = $id`,
        {
          $id: id,
          $updated_at: new Date().toISOString(),
        }
      );
      sqlite.saveDB();
      console.log(`Transfer with id=${id} soft deleted.`);
      return true;
    } catch (error) {
      console.log('Transfer delete error occurred:', error);
      return false;
    }
  }
}
