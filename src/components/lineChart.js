import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {LineChart} from 'react-native-chart-kit';

const LineChartComponent = ({title, chartConfig, data, width}) => {
  const adjustedChartConfig = {
    ...chartConfig,
    paddingLeft: '0px',
    paddingRight: '16px', // Adjust right padding if needed
    backgroundGradientFrom: chartConfig.backgroundGradientFrom || '#fff',
    backgroundGradientTo: chartConfig.backgroundGradientTo || '#fff',
    decimalPlaces: chartConfig.decimalPlaces || 2,
    color: chartConfig.color || ((opacity = 1) => `rgba(0, 0, 0, ${opacity})`),
    labelColor:
      chartConfig.labelColor || ((opacity = 1) => `rgba(0, 0, 0, ${opacity})`),
    style: {
      borderRadius: chartConfig.style?.borderRadius || 16,
    },
    propsForDots: {
      r: '1',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
    showDataPoints: chartConfig.showDataPoints || false,
  };

  const data1 = {
    labels: [
      '9a',
      '10a',
      '11a',
      '12p',
      '1p',
      '2p',
      '3p',
      '4p',
      '5p',
      '6p',
      '7p',
      '8p',
      '9p',
    ],
    datasets: [
      {
        data: [45, 30, 60, 50, 20, 30, 15, 45, 50, 40, 30, 10, 20],
      },
    ],
  };

  return (
    <View style={styles.lineChart}>
      <Text>{title}</Text>
      <LineChart
        data={data}
        width={width}
        height={220}
        yAxisLabel=""
        chartConfig={chartConfig}
        bezier
        style={{marginVertical: 8, borderRadius: 8}}
      />
    </View>
  );
};

export default LineChartComponent;

const styles = StyleSheet.create({
  lineChart: {
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    alignItems: 'center',
  },
});
