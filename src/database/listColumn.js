import {getDB} from './database';

export function listColumns() {
  const db = getDB(); // Ensure the database is already initialized
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'PRAGMA table_info(items);',
        [],
        (tx, results) => {
          console.log("Columns in 'items' table:");
          const columns = [];
          for (let i = 0; i < results.rows.length; i++) {
            columns.push(results.rows.item(i).name);
            console.log(results.rows.item(i).name);
          }
          resolve(columns); // Resolving the promise with the columns array
        },
        (tx, error) => {
          console.log('Error fetching columns: ', error);
          reject(error);
        },
      );
    });
  });
}
