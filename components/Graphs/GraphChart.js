import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View, processColor
} from 'react-native';
import update from 'immutability-helper';

import {LineChart} from 'react-native-charts-wrapper';

class GraphChart extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      marker: {
        enabled: true,
        digits: 0,
        markerColor: processColor('#FFF'),
        textSize: 14,
        textColor: processColor('black'),
      },
      yAxis: {
        left: {
          granularityEnabled: true,
          granularity : 1,
          textSize: 15,
          textColor: processColor('silver'),
          axisMinimum: 0
        },
        right: {
          granularityEnabled: true,
          granularity : 1,
          textSize: 15,
          textColor: processColor('silver'),
          axisMinimum: 0
        }
      }
    };
  }

  handleSelect(event) {
    let entry = event.nativeEvent
    if (entry == null) {
      this.setState({...this.state, selectedEntry: null})
    } else {
      this.setState({...this.state, selectedEntry: JSON.stringify(entry)})
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.container}>
          <LineChart
            style={styles.chart}
            data={this.props.data}
            chartDescription={{text: ''}}
            legend={{enabled: false}}
            xAxis={{
              granularityEnabled: true,
              granularity : 1,
              textSize: 15,
              textColor: processColor('silver'),
            }}
            yAxis={this.state.yAxis}
            drawGridBackground={true}
            marker={this.state.marker}
            borderColor={processColor('teal')}
            borderWidth={1}
            drawBorders={true}

            touchEnabled={true}
            dragEnabled={true}
            scaleEnabled={true}
            scaleXEnabled={true}
            scaleYEnabled={true}
            pinchZoom={true}
            chartBackgroundColor={processColor('rgba(0,0,0,0)')}
            gridBackgroundColor={processColor('rgba(0,0,0,0.0)')}

            dragDecelerationEnabled={true}
            dragDecelerationFrictionCoef={0.99}

            keepPositionOnRotation={false}
            onChange={(event) => console.log(event.nativeEvent)}
            
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chart: {
    flex: 1,
  }
});

export default GraphChart;