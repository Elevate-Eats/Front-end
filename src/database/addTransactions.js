import {getDB} from './database';
const db = getDB();

export function addTransaction(transaction) {
  return new Promise((resolve, reject) => {
    console.log(transaction);
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO transactions (id, transactiondate, discount, status, paymentmethod, totalprice, branchid, customername, tablenumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          transaction.id,
          transaction.transactiondate,
          transaction.discount,
          transaction.status,
          transaction.paymentmethod,
          transaction.totalprice,
          transaction.branchid,
          transaction.customername,
          transaction.tablenumber,
        ],
      )
        .then(([tx, results]) => {
          resolve(results);
        })
        .catch(error => {
            console.log(error);
          reject(error);
        });
    });
  });
}
