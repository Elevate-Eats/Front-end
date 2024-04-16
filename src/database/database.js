import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const databaseName = 'AppDatabase.db';
const databaseVersion = '1.0';
const databaseDisplayname = 'SQLite App Database';
const databaseSize = 200000;

let dbInitialized = false;
let db;

export function initDB() {
  return new Promise((resolve, reject) => {
    console.log('Plugin integrity check ...');
    SQLite.echoTest()
      .then(() => {
        console.log('Integrity check passed ...');
        console.log('Opening database ...');
        SQLite.openDatabase(
          databaseName,
          databaseVersion,
          databaseDisplayname,
          databaseSize,
        )
          .then(DB => {
            db = DB; // This now correctly sets the module-level `db`
            dbInitialized = true;
            console.log('Database OPEN');
            // First, drop the existing tables if they exist
            db.executeSql('DROP TABLE IF EXISTS items;')
              .then(() => {
                console.log('Items table dropped successfully');
                return db.executeSql('DROP TABLE IF EXISTS transactions;');
              })
              .then(() => {
                console.log('Transactions table dropped successfully');
                // Execute SQL to create the Transactions table
                return db.executeSql(
                  'CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY, transactiondate TEXT, discount REAL, status INTEGER, paymentmethod INTEGER, totalprice REAL, branchid INTEGER, customername TEXT, tablenumber INTEGER)',
                );
              })
              .then(() => {
                console.log('Transactions table created successfully');
                // Execute SQL to create the Items table
                return db.executeSql(
                  'CREATE TABLE IF NOT EXISTS items (id INTEGER, name TEXT, count INTEGER, menuid INTEGER, pricingcategory TEXT, transactionid INTEGER, price REAL, totalprice REAL, discount REAL, category TEXT, FOREIGN KEY(transactionId) REFERENCES transactions(id) ON DELETE CASCADE)',
                );
              })
              .then(() => {
                console.log('Items table created successfully');
                resolve(db);
              })
              .catch(error => {
                console.log('Error creating tables', error);
                reject(error);
              });
          })
          .catch(error => {
            console.log('Error opening database', error);
            reject(error);
          });
      })
      .catch(error => {
        console.log('echoTest failed - plugin not functional', error);
        reject(error);
      });
  });
}

export function getDB() {
  if (!dbInitialized) {
    throw new Error(
      'Database not initialized. Call initDB() and ensure it completes successfully.',
    );
  }
  return db;
}
