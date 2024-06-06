import React, {useEffect, useState} from 'react';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import Route from './src/routes/route';
import {PaperProvider} from 'react-native-paper';
import {Appearance} from 'react-native';
import {DarkTheme, LightTheme} from './src/themes';
const App = () => {
  const [theme, setTheme] = useState(
    Appearance.getColorScheme() === 'dark' ? DarkTheme : LightTheme,
  );

  useEffect(() => {
    const subcription = Appearance.addChangeListener(({colorScheme}) => {
      setTheme(colorScheme === 'dark' ? DarkTheme : LightTheme);
    });
    return () => subcription.remove();
  }, []);
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <Route />
      </PaperProvider>
    </Provider>
  );
};

export default App;
