import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Route from './src/routes/route';
import {PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Route />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
