import { Table } from './table';
import { Message as MessageType } from '../types';

export class Message extends Table {
  static get(): Array<MessageType> {
    return super.exec<MessageType>(`
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
}
