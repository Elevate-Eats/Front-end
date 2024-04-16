import {getDB} from './database';
const db = getDB();

export function deleteItems(transactionid) {
  return new Promise((resolve, reject) => {
    console.log('Deleting items for transaction ID:', transactionid);
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM items WHERE transactionid = ?',
        [transactionid],
        (tx, results) => {
          console.log('Items deleted successfully');
          resolve(results);
        },
        (tx, error) => {
          console.log('Error deleting items from database: ', error);
          reject(error);
        },
      );
    });
  });
}
