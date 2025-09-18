import _ from 'lodash';
import { sqlite } from '../config';
import { SyncStatus } from '../types';
import { BindParams } from 'sql.js';

export class Table {
  name: string | undefined;
  fields: Array<{
    name: string;
    type: 'TEXT' | 'INTEGER' | 'TIMESTAMP' | 'REAL' | 'DECIMAL(10,2)';
    required?: boolean;
    attrs?: string;
  }> = [];

  constructor(
    name?: string,
    fields?: Array<{
      name: string;
      type: 'TEXT' | 'INTEGER' | 'TIMESTAMP' | 'REAL' | 'DECIMAL(10,2)';
      required?: boolean;
      attrs?: string;
    }>
  ) {
    this.name = name;
    this.fields = fields ?? [];
  }

  public static exec<T>(query: string) {
    if (!sqlite.db || !this.name) return [];
    const execResult = sqlite.db!.exec(query);
    if (execResult.length > 0) {
      const { columns, values } = execResult[0];
      return values.map((v) => _.zipObject(columns, v)) as Array<T>;
    }
    return [] as Array<T>;
  }

  public get<T>(filter?: string): Array<T> {
    if (!sqlite.db || !this.name) return [];
    const result: unknown = Table.exec<T>(`
      SELECT * FROM ${this.name}
      ${filter ? ' WHERE ' + filter : ''}
    `);
    return result as Array<T>;
  }

  public retrieve<T>(query: string, filter: string): Array<T> {
    if (!sqlite.db || !this.name) return [];
    const wholeQuery = `${query} ${filter ? ' WHERE ' + filter : ''}`;
    const result: unknown = Table.exec<T>(wholeQuery);
    return result as Array<T>;
  }

  public create(params: Record<string, string | number | Date | boolean | null | undefined>): number | undefined {
    if (!sqlite.db || !this.name) return;
    // ✅ Check if table with same unique attribute exists
    const whereClause: Array<string> = [];
    this.fields.forEach((f) => {
      if (f.attrs && f.attrs.toLowerCase().includes('unique')) {
        if (!params[f.name]) {
          console.error(`Field '${f.name}' is required as the field supposed to be UNIQUE.`);
          return;
        }
        if (f.type === 'TEXT') whereClause.push(`${f.name} = '${params[f.name]}'`);
        else whereClause.push(`${f.name} = ${params[f.name]}`);
      }
    });
    if (whereClause.length > 0) {
      console.log(`SELECT * FROM accounts WHERE ${whereClause.join(' OR ')}`);
      const existing = Table.exec(
        `SELECT * FROM accounts ${whereClause.length > 0 ? 'WHERE ' + whereClause.join(' OR ') : ''}`
      );
      if (existing.length > 0) {
        console.error(`Account already exists, skipping.`);
        return; // Skip duplicate
      }
    }
    const bindParams: BindParams = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        bindParams[`$${key}`] = null;
      } else if (value instanceof Date) {
        bindParams[`$${key}`] = value.toISOString();
      } else if (typeof value === 'boolean') {
        bindParams[`$${key}`] = value ? 1 : 0;
      } else bindParams[`$${key}`] = value;
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    (bindParams['$created_at'] = new Date().toISOString()),
      (bindParams['$updated_at'] = new Date().toISOString()),
      (bindParams['$deleted'] = 0),
      sqlite.db?.run(
        `
      INSERT INTO ${this.name} (${Object.keys(params).join(', ')}, created_at, updated_at, deleted, sync_status)
      VALUES (${Object.keys(params)
        .map((p) => `$${p}`)
        .join(', ')}, $created_at, $updated_at, $deleted, '${SyncStatus.pending}')
      `,
        bindParams
      );
    document.dispatchEvent(new CustomEvent(`${this.name}.create`));
    // Get last inserted row id
    const lastId = sqlite.db?.exec('SELECT last_insert_rowid() as id')[0].values[0][0];
    sqlite.saveDB();
    return Number(lastId);
  }

  public update(params: Record<string, string | number | Date | boolean | null | undefined>) {
    if (!sqlite.db || !this.name) return;
    const bindParams: BindParams = {};
    const coalesces: Array<string> = [];
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (value instanceof Date) {
          bindParams[`$${key}`] = value.toISOString();
        } else if (typeof value === 'boolean') {
          bindParams[`$${key}`] = value ? 1 : 0;
        } else bindParams[`$${key}`] = value;
      }
      if (key !== 'id') coalesces.push(`${key} = COALESCE(excluded.${key}, ${this.name}.${key})`);
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    (bindParams['$created_at'] = new Date().toISOString()),
      (bindParams['$updated_at'] = new Date().toISOString()),
      (bindParams['$deleted'] = 0),
      sqlite.db?.run(
        `
      INSERT INTO ${this.name} (${Object.keys(params).join(', ')}, created_at, updated_at, deleted, sync_status)
      VALUES (${Object.keys(params)
        .map((p) => `$${p}`)
        .join(', ')}, $created_at, $updated_at, $deleted, '${SyncStatus.pending}')
      ON CONFLICT(id) DO UPDATE SET
        ${coalesces.join(', ')},
        sync_status='${SyncStatus.pending}'
      `,
        bindParams
      );
    window.dispatchEvent(new CustomEvent(`${this.name}.update`));
    sqlite.saveDB();
  }

  public delete(id: number) {
    if (!sqlite.db || !this.name) return false;
    try {
      sqlite.db?.run(
        `UPDATE ${this.name}
        SET deleted = 1,
            updated_at = $updated_at,
            sync_status = '${SyncStatus.pending}'
        WHERE id = $id`,
        {
          $id: id,
          $updated_at: new Date().toISOString(),
        }
      );
      window.dispatchEvent(new CustomEvent(`${this.name}.delete`));
      sqlite.saveDB();
      console.log(`Record with id=${id} soft deleted.`);
      return true;
    } catch (error) {
      console.log('Record delete error occurred:', error);
      return false;
    }
  }
}
