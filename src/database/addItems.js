import {getDB} from './database';
const db = getDB();

export function addItems(item) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      console.log('ADDITEMS: ', item);
      tx.executeSql(
        'UPDATE items SET count = ?, totalprice = ? WHERE menuid = ? AND transactionid = ?',
        [item.count, item.totalprice, item.menuid, item.transactionid],
        (tx, results) => {
          console.log('update result: ', results.rowsAffected);
          if (results.rowsAffected > 0) {
            console.log('Item updated successfully.');
            resolve(results);
          } else {
            console.log('No existing item to update, INSERT');
            tx.executeSql(
              'INSERT INTO items (id, name, discount, count, menuid, pricingcategory, transactionid, price, totalprice, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
              [
                item.id,
                item.name,
                item.discount,
                item.count,
                item.menuid,
                item.pricingcategory,
                item.transactionid,
                item.price,
                item.totalprice,
                item.category,
              ],
              (tx, results) => {
                console.log('Item inserted successfully.');
                resolve(results);
              },
              (tx, error) => {
                console.log('Error inserting item: ', error);
                reject(error);
              },
            );
          }
        },
        (tx, error) => {
          console.log('Error updating item: ', error);
          reject(error);
        },
      );
    });
  });
}
