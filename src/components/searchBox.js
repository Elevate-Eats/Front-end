import {StyleSheet, View} from 'react-native';
import {Text, Searchbar} from 'react-native-paper';
import React, {useState} from 'react';

const SearchBox = props => {
  const [query, setQuery] = useState('');
  return (
    <Searchbar
      placeholder={props.search}
      mode="bar"
      style={{borderRadius: 5, backgroundColor: '#e8e8e8'}}
      elevation={1}
      value={query}
      onChangeText={text => setQuery(text)}
    />
  );
};

export default SearchBox;

const styles = StyleSheet.create({});
