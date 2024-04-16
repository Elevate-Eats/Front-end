import {getDB} from './database';

export function deleteTransaction(id) {
  const db = getDB(); // Ensure the database has been initialized and is accessible
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM transactions WHERE id = ?',
        [id],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log(`Transaction with ID ${id} deleted successfully.`);
            resolve(results);
          } else {
            console.log(`No transaction found with ID ${id}.`);
            reject(`No transaction found with ID ${id}.`);
          }
        },
        (tx, error) => {
          console.log(`Error deleting transaction with ID ${id}:`, error);
          reject(error);
        },
      );
    });
  });
}
