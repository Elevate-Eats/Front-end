import {Dimensions, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import React from 'react';
import {BarChart} from 'react-native-chart-kit';
import {Colors} from '../utils/colors';

const BarChartComponent = ({data, title, suffix, label, barSize}) => {
  const chartConfig = {
    backgroundColor: '#FFFFFF',
    backgroundGradientFrom: '#f7f7f7',
    // backgroundGradientFrom: Colors.deleteColor,
    backgroundGradientTo: 'white',
    color: (opacity = 0.2) => `rgba(0, 0, 0, 0.7)`,
    barPercentage: barSize ? barSize : 0.6,
    useShadowColorFromDataset: false,
    propsForLabels: {
      fontSize: '10',
      fontWeight: '900',
    },
    decimalPlaces: 0,
  };
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>{title}</Text>
      <BarChart
        yAxisLabel={label}
        yAxisSuffix={suffix}
        data={data}
        style={{alignItems: 'center', paddingVertical: 15}}
        width={Dimensions.get('window').width * 0.92}
        chartConfig={chartConfig}
        height={250}
        fromZero={true}
        segments={5}
        verticalLabelRotation={-45}
      />
    </View>
  );
};

export default BarChartComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 2,
  },
  titleText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    userSelect: 'auto',
    letterSpacing: 0.6,
  },
});
