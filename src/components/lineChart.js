import {
  Dimensions,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import React from 'react';
import {LineChart} from 'react-native-gifted-charts';

const LineChartComponent = ({
  data1,
  data2,
  title,
  maxValue,
  legend1,
  legend2,
  suffix,
  area,
}) => {
  const lineData = [
    {value: 0, dataPointText: '0', label: '17 Apr'},
    {value: 10, dataPointText: '10', label: '18 Apr'},
    {value: 8, dataPointText: '8'},
    {value: 58, dataPointText: '58'},
    {value: 56, dataPointText: '56'},
    {value: 78, dataPointText: '78'},
    {value: 74, dataPointText: '74'},
    {value: 98, dataPointText: '98'},
  ];

  const lineData2 = [
    {value: 0, dataPointText: '0', label: '18 Apr'},
    {value: 20, dataPointText: '20'},
    {value: 18, dataPointText: '18'},
    {value: 40, dataPointText: '40'},
    {value: 36, dataPointText: '36'},
    {value: 60, dataPointText: '60'},
    {value: 54, dataPointText: '54'},
    {value: 85, dataPointText: '85'},
  ];

  return (
    <View style={{paddingVertical: 20, alignItems: 'center', gap: 15}}>
      <Text variant="titleMedium" style={styles.titleText}>
        {title}
      </Text>
      <View style={{flexDirection: 'row', gap: 20}}>
        {legend1 ? (
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <View
              style={{
                width: 15,
                height: 15,
                backgroundColor: 'skyblue',
              }}></View>
            <Text>{legend1}</Text>
          </View>
        ) : null}
        {legend2 ? (
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <View
              style={{width: 15, height: 15, backgroundColor: 'orange'}}></View>
            <Text>{legend2}</Text>
          </View>
        ) : null}
      </View>
      <LineChart
        areaChart={area === false ? false : true}
        isAnimated={true}
        delayBeforeUnFocus={500}
        animationDuration={1000}
        curved
        data={data1}
        data2={data2}
        height={300}
        showVerticalLines
        spacing={50}
        color1="skyblue"
        color2="orange"
        textColor1="black"
        dataPointsColor1="green"
        dataPointsColor2="red"
        startFillColor1="skyblue"
        startFillColor2="orange"
        startOpacity={0.8}
        endOpacity={0.3}
        textFontSize={14}
        maxValue={maxValue}
        yAxisLabelSuffix={suffix}
        animateTogether={true}
        animateOnDataChange={true}
        xAxisLabelTextStyle={{fontWeight: '700', fontSize: 13}}
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
  titleText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.6,
    // alignSelf: 'flex-start',
  },
});
