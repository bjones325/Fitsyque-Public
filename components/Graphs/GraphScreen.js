import React from 'react';
import {FlatList, Text, Platform, Dimensions, StyleSheet, TouchableOpacity, View, AsyncStorage, processColor} from 'react-native';
import TopBar from '../TopBar';
import GraphChart from './GraphChart';
import GraphRanges from './GraphRanges';
import GraphLists from './GraphLists';
const WINDOW = Dimensions.get('window')

export default class GraphScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            beginDate: new Date(),
            endDate: new Date()
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TopBar nav={this.props.navigation} onRef={ref => (this.topBar = ref)}
                    dotURL={"https://fitsyque.azurewebsites.net/DayList/DotDates"}
                    getData={(newDate) => {
                        this.setState({
                            endDate: newDate
                        })
                        var dif = this.graphRanges.getDateDif()
                        this.graphRanges.props.update(dif[0], dif[1], dif[2]);
                    }}/>
                <GraphRanges onRef={ref => (this.graphRanges = ref)}
                    update={(dayDif, monDif, yearDif) => {
                        var date = new Date(this.state.endDate)
                        date.setDate(date.getDate() - dayDif);
                        date.setMonth(date.getMonth() - monDif);
                        date.setFullYear(date.getFullYear() - yearDif);
                        this.setState({
                            beginDate: date
                        }, () => {
                            this.graphLists.requestWorkoutList()
                        });
                    }}/>
                {1 === 0 ?
                    <Text style={styles.emptyText}> No Workouts Logged </Text>
                :
                    <View style={{width: WINDOW.width, height: 400}}>
                        <GraphChart data={this.state.graphData}/>
                    </View>
                }
                <GraphLists setData={(data) => this.setGraphData(data)} beginDate={this.state.beginDate} endDate={this.state.endDate} onRef={ref => (this.graphLists = ref)}/>
            </View>
        );
    }

    setGraphData = (graphData) => {
        var returnval = {
            dataSets: [{
              values: graphData,
              label: 'Company X',
              config: {
                lineWidth: 2,
                drawCircles: true,
                circleColor: processColor('red'),
                circleRadius: 3,
                color: processColor('red'),
                drawValues: false,
                valueFormatter: '#'
              }
            }],
          }
        this.setState({
            graphData: returnval
        })     
    }

    parseData = (jsonData) => {
        var sections = {};
        for(var i = 0; i < jsonData.length; i++) {
            var item = sections[jsonData[i].Name];
            if (item == null) {
                sections[jsonData[i].Name] = [];
            }
            sections[jsonData[i].Name].push([
                jsonData[i].TypeID,
                jsonData[i].Sets,
                jsonData[i].Reps,
                jsonData[i].Weight,
                jsonData[i].Duration,
                jsonData[i].Intensity,
                jsonData[i].Incline,
                jsonData[i].Resistence,
            ])
        }
        this.setState({fullData: sections});
    }
};

const styles = StyleSheet.create({
    text: {
        color: 'red', //#841584
        fontWeight: 'bold',
        fontSize: 18,
    },
    
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)'
    },

    modal: {
        justifyContent: 'center',
        alignSelf: 'center',
        flex: 1
    },

    emptyText: {
        height: 400,
        padding: 20,
        alignSelf: 'center',
    },
});