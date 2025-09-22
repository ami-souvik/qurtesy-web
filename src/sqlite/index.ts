import initSqlJs, { Database as SqlDB } from 'sql.js';
import wasmUrl from '/sql-wasm.wasm?url';
import { sqlite } from '../config';
import { Table } from './table';
import schema from '../../schema.json';

export class SQlite {
  db: SqlDB | null = null;
  ready: Promise<boolean>;
  accounts: Table = new Table();
  categories: Table = new Table();
  transactions: Table = new Table();
  messages: Table = new Table();
  profiles: Table = new Table();
  config: Table = new Table();

  constructor() {
    this.ready = this.initialize();
  }

  // Utility: Save DB to IndexedDB
  async saveDB() {
    if (sqlite.db) {
      const data = sqlite.db.export(); // Uint8Array
      localStorage.setItem('mydb', JSON.stringify(Array.from(data)));
    }
  }

  // Utility: Load DB from IndexedDB
  async loadDB(SQL: initSqlJs.SqlJsStatic) {
    const saved = localStorage.getItem('mydb');
    if (saved) {
      const u8 = new Uint8Array(JSON.parse(saved));
      return new SQL.Database(u8); // load existing DB
    } else {
      return new SQL.Database(); // new empty DB
    }
  }

  async initialize() {
    if (!this.db) {
      console.log('Initialization started');
      const SQL = await initSqlJs({ locateFile: () => wasmUrl });
      this.db = await this.loadDB(SQL);
      try {
        const common = schema.find((s) => s.name === 'common') ?? { fields: [] };
        const schemas = schema.filter((s) => s.name !== 'common');
        let initSql = '';
        schemas.forEach((t) => {
          initSql += `
            CREATE TABLE IF NOT EXISTS ${t.name} (
                ${[...common.fields, ...t.fields]
                  .map((f) => `${f.name} ${f.type} ${f.required ? 'NOT NULL' : ''} ${f.attrs ?? ''}`)
                  .join(',\n')}
            );
            `;
          this[t.name as 'accounts' | 'categories' | 'transactions' | 'messages' | 'profiles' | 'config'] = new Table(
            t.name,
            [...common.fields, ...t.fields].map((f) => ({
              ...f,
              type: f.type as 'TEXT' | 'INTEGER' | 'TIMESTAMP' | 'REAL' | 'DECIMAL(10,2)',
            }))
          );
        });
        console.log(initSql);
        sqlite.db?.run(initSql);
      } catch (error) {
        console.log(error);
        return false;
      }
      console.log('Initialization done');
    }
    return true;
  }

  async sync() {
    if (!this.db) return;
  }
}

export * from './account';
export * from './category';
export * from './transaction';
export * from './message';
export * from './profile';
export * from './transfer';
