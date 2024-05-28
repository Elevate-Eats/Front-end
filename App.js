import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import Route from './src/routes/route';
import {PaperProvider} from 'react-native-paper';
const App = () => {
  return (
    <Provider store={store}>
      <PaperProvider>
        <Route />
      </PaperProvider>
    </Provider>
  );
};

export default App;
