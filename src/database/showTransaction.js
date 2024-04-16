import {getDB} from './database';
const db = getDB();

export function showTransaction() {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Transactions',
        [],
        (tx, results) => {
          let transactions = [];
          for (let i = 0; i < results.rows.length; i++) {
            transactions.push(results.rows.item(i));
          }
          resolve(transactions);
        },
        function (tx, error) {
          reject(error);
          console.log('Error while fetching transactions: ', error);
        },
      );
    });
  });
}
