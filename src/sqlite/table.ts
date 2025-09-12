import _ from 'lodash';
import { sqlite } from '../config';

export class Table {
  public static exec(query: string) {
    if (!sqlite.db) return [];
    const execResult = sqlite.db!.exec(query);
    if (execResult.length > 0) {
      const { columns, values } = execResult[0];
      return values.map((v) => _.zipObject(columns, v));
    }
    return [];
  }
}
