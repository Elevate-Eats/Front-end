import {getDB} from './database';
const db = getDB();

export function showItems(transactionid) {
  console.log('transaction ID: ', transactionid);
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Items WHERE transactionid = ?',
        [transactionid],
        (tx, results) => {
          let items = [];
          console.log('fetched item count: ', results.rows.length);
          for (let i = 0; i < results.rows.length; i++) {
            items.push(results.rows.item(i));
          }
          if (items.length > 0) {
            resolve(items);
          } else {
            console.log('no item found');
            resolve([]);
          }
          console.log('items', items);
          resolve(items);
        },
        function (tx, error) {
          console.log(
            'Error while fetching items for transaction ID: ',
            transactionid,
            error,
          );
          reject(error);
        },
      );
    });
  });
}
