import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  processColor,
} from 'react-native';

import {StackNavigator, SafeAreaView} from 'react-navigation';

import {PieChart} from 'react-native-charts-wrapper';

class PieGraph extends React.Component {

  constructor() {
    super();

    this.state = {
      legend: {
        enabled: false,
        textSize: 8,
        form: 'CIRCLE',
        position: 'RIGHT_OF_CHART',
        wordWrapEnabled: true
      },
      data: {
        dataSets: [{
          values: [{value: 40},
            {value: 21},
            {value: 15},
            {value: 9},
            {value: 15}],
          //label: 'Pie dataset',
          config: {
            colors: [processColor('#C0FF8C'), processColor('#FFF78C'), processColor('#FFD08C')],
            valueTextSize: 100,
            valueTextColor: processColor('#ffffff'),
            sliceSpace: 0,
            selectionShift: 13
          }
        }],
      },
      highlights: [{x:2}],
      description: {
        text: '',
        textSize: 0,
        textColor: processColor('darkgray'),

      }
    };
  }

  handleSelect(event) {
    let entry = event.nativeEvent
    if (entry == null) {
      this.props.onSelect(null)
    } else if (entry.data == null) {
      this.props.onSelect(null)
    } else {
      this.props.onSelect(entry.data.id)
    }
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <PieChart
            style={styles.chart}
            logEnabled={true}
            //chartBackgroundColor={processColor('pink')}
            chartDescription={this.state.description}
            data={this.props.data}
            legend={this.state.legend}
            highlights={this.state.highlights}
            touchEnabled={false}

            entryLabelColor={processColor('black')}
            entryLabelTextSize={20}
            drawEntryLabels={true}

            rotationEnabled={true}
            rotationAngle={45}
            usePercentValues={true}
            //styledCenterText={{text:'Pie center text!', color: processColor('pink'), size: 20}}
            centerTextRadiusPercent={100}
            holeRadius={40}
            holeColor={processColor('#f0f0f0')}
            transparentCircleRadius={45}
            onSelect={this.handleSelect.bind(this)}
            transparentCircleColor={processColor('#f0f0f088')}
            maxAngle={360}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 350,
    width: 250
  },
  chart: {
    flex: 1
  }
});

export default PieGraph;
