import { Table } from './table';
import { sqlite } from '../config';
import { CreateMessage, SyncStatus } from '../types';

export class Message extends Table {
  instance = null;

  static initialize() {
    sqlite.db.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY,
        command TEXT,
        is_agent BOOLEAN,
        transaction_id INTEGER,
        transaction_type INTEGER,
        category_id INTEGER,
        account_id INTEGER,
        
        created_at TEXT,
        updated_at TEXT,
        deleted BOOLEAN DEFAULT 0,
        sync_status TEXT DEFAULT 'synced'
      );
    `);
  }

  static get() {
    return super.exec(`
      SELECT
        m.id,
        m.command,
        m.is_agent,
        m.transaction_id,
        m.created_at,
        m.updated_at,
        m.deleted,
        m.sync_status,
        t.date AS transaction_date,
        t.type AS transaction_type,
        t.amount AS transaction_amount,
        c.name AS category_name,
        a.name AS account_name
      FROM messages m
      LEFT JOIN transactions t ON m.transaction_id = t.id
      LEFT JOIN categories c ON m.category_id = c.id
      LEFT JOIN accounts a ON m.account_id = a.id
    `);
  }

  static create(msg: CreateMessage) {
    try {
      // ✅ Check if account with same name exists
      sqlite.db.run(
        `
        INSERT INTO messages (command, is_agent, transaction_id, transaction_type, category_id, account_id, created_at, updated_at, deleted, sync_status)
        VALUES ($command, $is_agent, $transaction_id, $transaction_type, $category_id, $account_id, $created_at, $updated_at, $deleted, '${SyncStatus.PENDING}')
      `,
        {
          $command: msg.command,
          $is_agent: msg.is_agent || false,
          $transaction_id: msg.transaction_id || null,
          $transaction_type: msg.transaction_type || null,
          $category_id: msg.category_id || null,
          $account_id: msg.account_id || null,
          $created_at: new Date().toISOString(),
          $updated_at: new Date().toISOString(),
          $deleted: false,
        }
      );
      // Propagate message create event
      document.dispatchEvent(new Event('createMessage'));
      sqlite.saveDB();
    } catch (error) {
      console.error('Error occurred while inserting Message: ', error);
    }
  }
}
