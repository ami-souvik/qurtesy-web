import { AxiosResponse } from 'axios';
import { Table } from './table';
import { sqlite, api } from '../config';
import { Category as CategoryType, SyncStatus } from '../types';

export class Category extends Table {
  instance = null;

  static initialize() {
    sqlite.db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY,
        name TEXT UNIQUE,
        emoji TEXT,
        section TEXT,
        updated_at TEXT,
        deleted INTEGER DEFAULT 0,
        sync_status TEXT DEFAULT 'synced'
      );
    `);
  }

  static get(): Array<CategoryType> {
    const result: unknown = super.exec(`
      SELECT id, name, emoji, section, updated_at, deleted, sync_status FROM categories
    `);
    return result as Array<CategoryType>;
  }

  static bulk(data: Array<CategoryType>) {
    const result: Array<CategoryType> = [];
    data.forEach((cat) => {
      try {
        // ✅ Check if category with same name exists
        const existing = super.exec(`SELECT * FROM categories WHERE name = '${cat.name}' LIMIT 1`);
        if (existing.length > 0) {
          console.warn(`Category with name "${cat.name}" already exists, skipping.`);
          result.push({
            ...existing[0],
          });
          return; // Skip duplicate
        }
        sqlite.db.run(
          `
          INSERT INTO categories (name, emoji, section, updated_at, deleted, sync_status)
          VALUES ($name, $emoji, $section, $updated_at, $deleted, '${SyncStatus.PENDING}')
        `,
          {
            $name: cat.name,
            $emoji: cat.emoji,
            $section: cat.section,
            $updated_at: cat.updated_at || new Date().toISOString(),
            $deleted: cat?.deleted || false,
          }
        );
        // Get last inserted row id
        const lastId = sqlite.db.exec('SELECT last_insert_rowid() as id')[0].values[0][0];
        result.push({
          ...cat,
          id: Number(lastId),
        });
      } catch (error) {
        console.log('Error occurred while bulk inserting data: ', error);
      }
    });
    sqlite.saveDB();
    return result;
  }

  static async sync() {
    try {
      // Pull remote changes
      console.log('Category Sync Started');
      const { data }: AxiosResponse<Array<CategoryType>> = await api.get('/categories/');
      console.log('Category Sync Data Fetched');
      data.forEach((cat) => {
        sqlite.db.run(
          `
          INSERT INTO categories (id, name, emoji, section, updated_at, deleted, sync_status)
          VALUES ($id, $name, $emoji, $section, $updated_at, $deleted, '${SyncStatus.SYNCED}')
          ON CONFLICT(id) DO UPDATE SET
            name=excluded.name,
            emoji=excluded.emoji,
            section=excluded.section,
            updated_at=excluded.updated_at,
            deleted=excluded.deleted,
            sync_status='${SyncStatus.SYNCED}'
        `,
          {
            $id: cat.id,
            $name: cat.name,
            $emoji: cat.emoji,
            $section: cat.section,
            $updated_at: cat.updated_at,
            $deleted: cat?.deleted || false,
          }
        );
      });
      console.log('Category Synced');
      return true;
    } catch (error) {
      console.log('Category sync error occurred: ', error);
      return false;
    }
  }

  static create(cat: CategoryType) {
    // ✅ Check if category with same name exists
    const existing = super.exec(`SELECT * FROM categories WHERE name = '${cat.name}' LIMIT 1`);
    if (existing.length > 0) {
      console.warn(`Category with name "${cat.name}" already exists, skipping.`);
      return; // Skip duplicate
    }
    sqlite.db.run(
      `
      INSERT INTO categories (name, emoji, section, updated_at, deleted, sync_status)
      VALUES ($name, $emoji, $section, $updated_at, $deleted, '${SyncStatus.PENDING}')
    `,
      {
        $name: cat.name,
        $emoji: cat.emoji,
        $section: cat.section,
        $updated_at: cat.updated_at || new Date().toISOString(),
        $deleted: cat?.deleted || false,
      }
    );
    sqlite.saveDB();
  }

  static update(cat: CategoryType) {
    console.log(cat);
    sqlite.db.run(
      `
      INSERT INTO categories (id, name, emoji, section, updated_at, deleted, sync_status)
      VALUES ($id, $name, $emoji, $section, $updated_at, $deleted, '${SyncStatus.SYNCED}')
      ON CONFLICT(id) DO UPDATE SET
        name=excluded.name,
        emoji=excluded.emoji,
        section=excluded.section,
        updated_at=excluded.updated_at,
        deleted=excluded.deleted,
        sync_status='${SyncStatus.SYNCED}'
    `,
      {
        $id: cat.id,
        $name: cat.name,
        $emoji: cat.emoji,
        $section: cat.section,
        $updated_at: cat.updated_at,
        $deleted: cat?.deleted || false,
      }
    );
    sqlite.saveDB();
  }

  static delete(id: number) {
    try {
      sqlite.db.run(
        `UPDATE categories
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
      console.log(`Category with id=${id} soft deleted.`);
      return true;
    } catch (error) {
      console.log('Category delete error occurred:', error);
      return false;
    }
  }
}
