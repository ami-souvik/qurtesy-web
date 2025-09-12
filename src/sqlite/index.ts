import initSqlJs, { Database as SqlDB } from 'sql.js';
import wasmUrl from '/sql-wasm.wasm?url';
import { Account } from './account';
import { Category } from './category';
import { Transaction } from './transaction';
import { Message } from './message';
import { sqlite } from '../config';

export class SQlite {
  db: SqlDB | null = null;
  ready: Promise<boolean>;

  constructor() {
    this.ready = this.initialize();
  }

  // Utility: Save DB to IndexedDB
  async saveDB() {
    const data = sqlite.db.export(); // Uint8Array
    localStorage.setItem('mydb', JSON.stringify(Array.from(data)));
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
        Account.initialize();
        Category.initialize();
        Transaction.initialize();
        Message.initialize();
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
    console.log('Sync started');
    await Account.sync();
    await Category.sync();
    // await Transaction.sync()
    console.log('Sync done');
  }
}

export * from './account';
export * from './category';
export * from './transaction';
export * from './message';
