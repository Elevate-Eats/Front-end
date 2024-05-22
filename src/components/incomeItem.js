import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import React from 'react';
import {Colors} from '../utils/colors';
import FormatRP from '../utils/formatRP';

const IncomeItem = ({
  type,
  title,
  loading,
  center,
  left,
  right,
  centerName,
  leftName,
  rightName,
}) => {
  const renderValue = (value, color) =>
    loading ? (
      <ActivityIndicator
        size={25}
        color={Colors.btnColor}
        style={styles.loader}
      />
    ) : (
      <Text style={[styles.valueText, {color}]}>{value}</Text>
    );

  const renderSection = (label, value, color) => (
    <View style={styles.sectionContainer}>
      {renderValue(value, color)}
      <Text style={styles.section}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titleText} variant="titleMedium">
        {title}
      </Text>
      <View style={styles.divider} />
      {renderValue(
        type === 'money' ? FormatRP(center) : center,
        center > 0 ? 'green' : Colors.deleteColor,
      )}
      <Text style={styles.section}>{centerName}</Text>
      <View style={styles.divider} />
      <View style={styles.row}>
        {renderSection(
          leftName,
          type === 'money' ? FormatRP(left) : left,
          'green',
        )}
        {renderSection(
          rightName,
          type === 'money' ? FormatRP(right) : right,
          Colors.deleteColor,
        )}
      </View>
    </View>
  );
};

export default IncomeItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7f7f7',
    shadowColor: '#000',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  titleText: {
    alignSelf: 'center',
    color: 'grey',
    fontSize: 18,
  },
  divider: {
    backgroundColor: 'grey',
    height: 1,
    marginVertical: 10,
  },
  loader: {
    paddingVertical: 5,
  },
  valueText: {
    fontSize: 24,
    fontWeight: '800',
    alignSelf: 'center',
  },
  section: {
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: '500',
    color: 'grey',
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  sectionContainer: {
    flex: 1,
  },
});
