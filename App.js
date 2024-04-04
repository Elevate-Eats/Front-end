import {StyleSheet, Text, View} from 'react-native';
import React, {createContext, useContext, useState} from 'react';
import Route from './src/routes/route';
import {PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';

const DataContext = createContext();

const App = ({children}) => {
  const [globalData, setGlobalData] = useState(null);
  return (
    <DataContext.Provider value={{globalData, setGlobalData}}>
      {children}
      <PaperProvider>
        <Route />
      </PaperProvider>
    </DataContext.Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
