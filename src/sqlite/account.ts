import { Table } from './table';
import { sqlite } from '../config';
import { Account as AccountType, CreateAccount, SyncStatus } from '../types';

export class Account extends Table {
  static bulk(data: Array<CreateAccount>) {
    const result: Array<AccountType> = [];
    data.forEach((acc) => {
      try {
        // ✅ Check if account with same name exists
        const existing = super.exec<AccountType>(`SELECT * FROM accounts WHERE name = '${acc.name}' LIMIT 1`);
        if (existing.length > 0) {
          console.warn(`Account with name "${acc.name}" already exists, skipping.`);
          result.push({
            ...existing[0],
          });
          return; // Skip duplicate
        }
        sqlite.db?.run(
          `
          INSERT INTO accounts (name, balance, created_at, updated_at, deleted, sync_status)
          VALUES ($name, $balance, '${new Date().toISOString()}', '${new Date().toISOString()}', 0, '${SyncStatus.pending}')
        `,
          {
            $name: acc.name,
            $balance: acc.balance ?? 0,
          }
        );
        // Get last inserted row id
        const lastId = sqlite.db?.exec('SELECT last_insert_rowid() as id')[0].values[0][0];
        result.push({
          ...acc,
          created_at: new Date(),
          updated_at: new Date(),
          deleted: false,
          id: Number(lastId),
          sync_status: SyncStatus.pending,
        });
        sqlite.saveDB();
      } catch (error) {
        console.log(acc);
        console.log('Account bulk insert error occurred: ', error);
      }
    });
    return result;
  }

  static async sync() {}
}
