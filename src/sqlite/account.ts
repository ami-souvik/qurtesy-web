import { AxiosResponse } from 'axios';
import { Table } from './table';
import { sqlite, api } from '../config';
import { Account as AccountType, SyncStatus } from '../types';

export class Account extends Table {
  instance = null;

  static initialize() {
    sqlite.db.run(`
      CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY,
        name TEXT UNIQUE,
        balance DECIMAL(10,2),
        updated_at TEXT,
        deleted BOOLEAN DEFAULT 0,
        sync_status TEXT DEFAULT 'synced'
      );
    `);
  }

  static get(): Array<AccountType> {
    const result: unknown = super.exec(`
      SELECT id, name, balance, updated_at, deleted, sync_status FROM accounts
    `);
    return result as Array<AccountType>;
  }

  static bulk(data: Array<AccountType>) {
    const result: Array<AccountType> = [];
    data.forEach((acc) => {
      try {
        // ✅ Check if account with same name exists
        const existing = super.exec(`SELECT * FROM accounts WHERE name = '${acc.name}' LIMIT 1`);
        if (existing.length > 0) {
          console.warn(`Account with name "${acc.name}" already exists, skipping.`);
          result.push({
            ...existing[0],
          });
          return; // Skip duplicate
        }
        sqlite.db.run(
          `
          INSERT INTO accounts (name, balance, updated_at, deleted, sync_status)
          VALUES ($name, $balance, $updated_at, $deleted, '${SyncStatus.PENDING}')
        `,
          {
            $name: acc.name,
            $balance: acc.balance || 0,
            $updated_at: acc.updated_at || new Date().toISOString(),
            $deleted: acc?.deleted || false,
          }
        );
        // Get last inserted row id
        const lastId = sqlite.db.exec('SELECT last_insert_rowid() as id')[0].values[0][0];
        result.push({
          ...acc,
          id: Number(lastId),
        });
        sqlite.saveDB();
      } catch (error) {
        console.log(acc);
        console.log('Account bulk insert error occurred: ', error);
      }
    });
    return result;
  }

  static async sync() {
    try {
      // Push local changes
      // let stmt = db.prepare("SELECT * FROM accounts WHERE sync_status='pending'");
      // let pending = [];
      // while (stmt.step()) {
      //   pending.push(stmt.getAsObject());
      // }
      // if (pending.length > 0) {
      // // Bulk Upsert
      //   await api.post("/accounts/bulk", []);
      //   db.run("UPDATE accounts SET sync_status='synced' WHERE sync_status='pending'");
      // }

      // Pull remote changes
      console.log('Account Sync Started');
      const { data }: AxiosResponse<Array<AccountType>> = await api.get('/accounts/');
      console.log('Account Sync Data Fetched');
      data.forEach((acc) => {
        sqlite.db.run(
          `
          INSERT INTO accounts (id, name, balance, updated_at, deleted, sync_status)
          VALUES ($id, $name, $balance, $updated_at, $deleted, '${SyncStatus.SYNCED}')
          ON CONFLICT(id) DO UPDATE SET
            name=excluded.name,
            balance=excluded.balance,
            updated_at=excluded.updated_at,
            deleted=excluded.deleted,
            sync_status='${SyncStatus.SYNCED}'
        `,
          {
            $id: acc.id,
            $name: acc.name,
            $balance: acc.balance || 0,
            $updated_at: acc.updated_at || new Date().toISOString(),
            $deleted: acc?.deleted || false,
          }
        );
      });
      console.log('Account Synced');
      sqlite.saveDB();
      return true;
    } catch (error) {
      console.log('Account sync error occurred: ', error);
      return false;
    }
  }

  static create(acc: AccountType) {
    // ✅ Check if account with same name exists
    const existing = super.exec(`SELECT * FROM accounts WHERE name = '${acc.name}' LIMIT 1`);
    if (existing.length > 0) {
      console.warn(`Account with name "${acc.name}" already exists, skipping.`);
      return; // Skip duplicate
    }
    sqlite.db.run(
      `
      INSERT INTO accounts (name, balance, updated_at, deleted, sync_status)
      VALUES ($name, $balance, $updated_at, $deleted, '${SyncStatus.PENDING}')
    `,
      {
        $name: acc.name,
        $balance: acc.balance || 0,
        $updated_at: acc.updated_at || new Date().toISOString(),
        $deleted: acc?.deleted || false,
      }
    );
    sqlite.saveDB();
  }

  static update(acc: AccountType) {
    sqlite.db.run(
      `
      INSERT INTO accounts (id, name, balance, updated_at, deleted, sync_status)
      VALUES ($id, $name, $balance, $updated_at, $deleted, '${SyncStatus.SYNCED}')
      ON CONFLICT(id) DO UPDATE SET
        name=excluded.name,
        balance=excluded.balance,
        updated_at=excluded.updated_at,
        deleted=excluded.deleted,
        sync_status='${SyncStatus.SYNCED}'
    `,
      {
        $id: acc.id,
        $name: acc.name,
        $balance: acc.balance || 0,
        $updated_at: acc.updated_at || new Date().toISOString(),
        $deleted: acc?.deleted || false,
      }
    );
    sqlite.saveDB();
  }

  static delete(id: number) {
    try {
      sqlite.db.run(
        `UPDATE accounts
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
      console.log(`Account with id=${id} soft deleted.`);
      return true;
    } catch (error) {
      console.log('Account delete error occurred:', error);
      return false;
    }
  }
}
