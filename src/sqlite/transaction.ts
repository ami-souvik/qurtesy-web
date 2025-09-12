import { Table } from './table';
import { sqlite } from '../config';
import { SyncStatus, Transaction as TransactionType, CreateTransaction } from '../types';

export class Transaction extends Table {
  instance = null;

  static initialize() {
    sqlite.db.run(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL CHECK (type IN ('expense', 'income', 'transfer', 'lending', 'split')),
        amount REAL NOT NULL,
        category_id INTEGER,
        account_id INTEGER NOT NULL,
        transfer_account_id INTEGER,
        counterparty TEXT,
        note TEXT,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        recurring_rule TEXT,
        parent_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted INTEGER DEFAULT 0,
        sync_status TEXT DEFAULT 'synced'
      );
    `);
  }

  static bulk(data: Array<TransactionType>) {
    data.forEach((txn) => {
      try {
        txn = {
          ...txn,
          date: txn.date || new Date(),
          created_at: new Date(),
          updated_at: new Date(),
          deleted: false,
        };
        sqlite.db.run(
          `
          INSERT INTO transactions (type, amount, account_id, category_id, note, date, transfer_account_id, counterparty, recurring_rule, parent_id, created_at, updated_at, deleted, sync_status)
          VALUES ($type, $amount, $account_id, $category_id, $note, $transfer_account_id, $counterparty, $recurring_rule, $parent_id, $created_at, $updated_at, $deleted, '${SyncStatus.PENDING}}')
        `,
          {
            $type: txn.type,
            $amount: txn.amount,
            $account_id: txn.account_id,
            $category_id: txn.category_id,
            $note: txn.note,
            $date: txn.date.toISOString(),
            $transfer_account_id: txn.transfer_account_id,
            $counterparty: txn.counterparty,
            $recurring_rule: txn.recurring_rule,
            $parent_id: txn.parent_id,
            $created_at: txn.created_at.toISOString(),
            $updated_at: txn.updated_at.toISOString(),
            $deleted: txn.deleted,
          }
        );
      } catch (error) {
        console.log(txn);
        console.log('Error occurred while bulk inserting data: ', error);
      }
    });
    sqlite.saveDB();
  }

  static getByYearMonth(y: number, m: number) {
    return super.exec(`
      SELECT
        t.id,
        t.type,
        t.amount,
        t.date,
        t.note,
        t.updated_at,
        t.deleted,
        t.sync_status,
        c.id AS category_id,
        c.name AS category_name,
        c.emoji AS category_emoji,
        a.id AS account_id,
        a.name AS account_name
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN accounts a ON t.account_id = a.id
      WHERE strftime('%Y', date) = '${y}'
      AND strftime('%m', date) = '${String(m + 1).padStart(2, '0')}'
    `);
  }

  static create(ctxn: CreateTransaction): TransactionType {
    const txn: TransactionType = {
      ...ctxn,
      date: ctxn.date || new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      deleted: false,
    };
    try {
      sqlite.db.run(
        `
        INSERT INTO transactions (type, amount, account_id, category_id, note, date, transfer_account_id, counterparty, recurring_rule, parent_id, created_at, updated_at, deleted, sync_status)
        VALUES ($type, $amount, $account_id, $category_id, $note, $date, $transfer_account_id, $counterparty, $recurring_rule, $parent_id, $created_at, $updated_at, $deleted, '${SyncStatus.PENDING}}')
      `,
        {
          $type: txn.type,
          $amount: txn.amount,
          $account_id: txn.account_id,
          $category_id: txn.category_id || null,
          $note: txn.note,
          $date: txn.date.toISOString(),
          $transfer_account_id: txn.transfer_account_id || null,
          $counterparty: txn.counterparty || null,
          $recurring_rule: txn.recurring_rule || null,
          $parent_id: txn.parent_id || null,
          $created_at: txn.created_at.toISOString(),
          $updated_at: txn.updated_at.toISOString(),
          $deleted: txn.deleted,
        }
      );
      const lastId = sqlite.db.exec('SELECT last_insert_rowid() as id')[0].values[0][0];
      sqlite.saveDB();
      txn.id = lastId;
    } catch (error) {
      console.log('Error occurred while inserting Transaction: ', error);
    }
    return txn;
  }

  static delete(id: number) {
    try {
      sqlite.db.run(
        `UPDATE transactions
        SET deleted = 1,
            updated_at = $updated_at,
            sync_status = '${SyncStatus.PENDING}'
        WHERE id = $id`,
        {
          $id: id,
          $updated_at: new Date().toISOString(),
        }
      );
      sqlite.saveDB();
      console.log(`Transaction with id=${id} soft deleted.`);
      return true;
    } catch (error) {
      console.log('Transaction delete error occurred:', error);
      return false;
    }
  }
}
