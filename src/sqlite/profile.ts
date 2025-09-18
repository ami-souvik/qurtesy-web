import { Table } from './table';
import { sqlite } from '../config';
import { Profile as ProfileType, SyncStatus } from '../types';

export class Profile extends Table {
  static get(): Array<ProfileType> {
    const result: unknown = super.exec(`
      SELECT id, name, email, phone, avatar_url, updated_at, deleted, sync_status FROM profiles
    `);
    return result as Array<ProfileType>;
  }

  static bulk(data: Array<ProfileType>) {
    const result: Array<ProfileType> = [];
    data.forEach((prof) => {
      try {
        // ✅ Check if profile with same email or phone exists
        const existing = super.exec<ProfileType>(
          `SELECT * FROM profiles WHERE email = '${prof.email}' OR phone = '${prof.phone}' LIMIT 1`
        );
        if (existing.length > 0) {
          console.warn(`Profile with email "${prof.email}" or phone "${prof.phone}" already exists, skipping.`);
          result.push({
            ...existing[0],
          });
          return; // Skip duplicate
        }
        sqlite.db?.run(
          `
          INSERT INTO profiles (name, email, phone, avatar_url, created_at, updated_at, deleted, sync_status)
          VALUES ($name, $email, $phone, $avatar_url, $created_at, $updated_at, $deleted, '${SyncStatus.pending}')
        `,
          {
            $name: prof.name,
            $email: prof.email ?? null,
            $phone: prof.phone ?? null,
            $avatar_url: prof.avatar_url ?? null,
            $created_at: (prof.created_at ?? new Date()).toISOString(),
            $updated_at: (prof.updated_at ?? new Date()).toISOString(),
            $deleted: prof.deleted ? 1 : 0,
          }
        );
        // Get last inserted row id
        const lastId = sqlite.db?.exec('SELECT last_insert_rowid() as id')[0].values[0][0];
        result.push({
          ...prof,
          id: Number(lastId),
        });
        sqlite.saveDB();
      } catch (error) {
        console.log(prof);
        console.log('Profile bulk insert error occurred: ', error);
      }
    });
    return result;
  }

  static async sync() {}
}
