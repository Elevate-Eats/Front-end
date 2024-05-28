import {
  Dimensions,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import React from 'react';
import {LineChart} from 'react-native-chart-kit';

const LineChartComponent = ({
  title,
  chartConfig,
  data,
  width,
  label,
  suffix,
  onPress,
}) => {
  const screenWidth = Dimensions.get('window').width;
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

  return (
    <Pressable style={styles.lineChart} onPress={onPress}>
      <View style={{flexDirection: 'row', paddingVertical: 10}}>
        <Text style={[styles.titleText, {alignSelf: 'flex-start', flex: 1}]}>
          {title}
        </Text>
        <TouchableOpacity onPress={onPress}>
          <Text
            style={[
              styles.titleText,
              {
                alignSelf: 'flex-end',
                textDecorationLine: 'underline',
                fontSize: 12,
              },
            ]}>
            Details
          </Text>
        </TouchableOpacity>
      </View>
      <LineChart
        yAxisSuffix={suffix}
        data={data}
        width={width || screenWidth - 20}
        height={220}
        yAxisLabel={label}
        chartConfig={adjustedChartConfig}
        bezier
        style={{marginVertical: 8, borderRadius: 8}}
        verticalLabelRotation={-90}
      />
    </Pressable>
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
  titleText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.6,
    // alignSelf: 'flex-start',
  },
});
