import { Table } from './table';
import { sqlite } from '../config';
import { Category as CategoryType, CreateCategory, SyncStatus } from '../types';

export class Category extends Table {
  static bulk(data: Array<CreateCategory>) {
    const result: Array<CategoryType> = [];
    data.forEach((cat) => {
      try {
        // ✅ Check if category with same name exists
        const existing = super.exec<CategoryType>(`SELECT * FROM categories WHERE name = '${cat.name}' LIMIT 1`);
        if (existing.length > 0) {
          console.warn(`Category with name "${cat.name}" already exists, skipping.`);
          result.push({
            ...existing[0],
          });
          return; // Skip duplicate
        }
        sqlite.db?.run(
          `
          INSERT INTO categories (name, emoji, type, created_at, updated_at, deleted, sync_status)
          VALUES ($name, $emoji, $type, $created_at, $updated_at, $deleted, '${SyncStatus.pending}')
        `,
          {
            $name: cat.name,
            $emoji: cat.emoji ?? null,
            $type: cat.type,
            $created_at: new Date().toISOString(),
            $updated_at: new Date().toISOString(),
            $deleted: 0,
          }
        );
        // Get last inserted row id
        const lastId = sqlite.db?.exec('SELECT last_insert_rowid() as id')[0].values[0][0];
        result.push({
          ...cat,
          created_at: new Date(),
          updated_at: new Date(),
          deleted: false,
          id: Number(lastId),
          sync_status: SyncStatus.pending,
        });
      } catch (error) {
        console.log('Error occurred while bulk inserting data: ', error);
      }
    });
    sqlite.saveDB();
    return result;
  }

  static async sync() {}
}
