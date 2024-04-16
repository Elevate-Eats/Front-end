import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import Route from './src/routes/route';
import {PaperProvider} from 'react-native-paper';
import {initDB} from './src/database/database';

const App = () => {
  useEffect(() => {
    initDB()
      .then(db => {
        console.log('Database Intialized');
      })
      .catch(error => {
        console.error('Database Failed to Open', error);
      });
  }, []);
  return (
    <Provider store={store}>
      <PaperProvider>
        <Route />
      </PaperProvider>
    </Provider>
  );
};

export default App;
