import {Dimensions, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useEffect} from 'react';
// import {BarChart} from 'react-native-chart-kit';
import {Colors} from '../utils/colors';
import {BarChart, yAxisSides} from 'react-native-gifted-charts';

const BarChartComponent = ({data, title, suffix, label, barSize}) => {
  return (
    <View style={{marginVertical: 20, gap: 15, alignItems: 'center'}}>
      <Text style={styles.titleText}>{title}</Text>
      <BarChart
        rulesType="solid"
        isAnimate={true}
        noOfSections={5}
        barBorderRadius={5}
        frontColor={'skyblue'}
        adjustToWidth
        data={data}
        scrollAnimation={true}
        yAxisThickness={0}
        xAxisThickness={0}
        animationDuration={1000}
        xAxisLabelTextStyle={{fontWeight: '700', fontSize: 10}}
        // showGradient
        gradientColor={'#00AA17'}
        // renderTooltip={(item, index) => {
        //   return (
        //     <View
        //       style={{
        //         marginLeft: 1,
        //         padding: 6,
        //         flex: 1,
        //         justifyContent: 'center',
        //       }}>
        //       <Text>{item.value.toFixed(2)}</Text>
        //     </View>
        //   );
        // }}
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
