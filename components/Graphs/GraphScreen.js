import React from 'react';
import {FlatList, Text, Platform, Dimensions, StyleSheet, TouchableOpacity, View, AsyncStorage, processColor} from 'react-native';
import { NavigationActions } from 'react-navigation';
import TopBar from '../TopBar';
import Modal from "react-native-modal";
import DropdownAlert from 'react-native-dropdownalert';
import GraphChart from './GraphChart';
import GraphRanges from './GraphRanges';
import Network from '../Network'
const WINDOW = Dimensions.get('window')


export default class GraphScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            selectedWorkout: {},
            selectedValueSet: [],
            beginDate: new Date(),
            endDate: new Date(),
            workoutNames: [],
            fullData: [],
            refresh: false
        }
        this.requestWorkoutList(new Date(), new Date());
    }

    requestWorkoutList = () => {
        AsyncStorage.getItem('@app:session').then((token) => {
            return fetch('https://fitsyque.azurewebsites.net/Graph/WorkoutList', {
                method: "get",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token,
                    beginDate: this.state.beginDate.toISOString().substring(0, 10),
                    endDate: this.state.endDate.toISOString().substring(0, 10),
                }
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if(!responseJson.success) {
                this.props.navigation.dispatch(resetB);
                alert(responseJson.message);
            } else {
                this.setState({workoutNames: responseJson.data, selectedWorkout: {}, selectedValueSet: [], fullData: [], dataTypes: []});
            }
        })
        .catch((error) => {
            console.log(error);
            alert("There was an internal error while connecting! Please restart the app.")
        });
    }

    requestWorkoutData = (exerciseID) => {
        AsyncStorage.getItem('@app:session').then((token) => {
            return fetch('https://fitsyque.azurewebsites.net/Graph/Data', {
                method: "get",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token,
                    beginDate: this.state.beginDate.toISOString().substring(0, 10),
                    endDate: this.state.endDate.toISOString().substring(0, 10),
                    ExerciseID: exerciseID
                }
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if(!responseJson.success) {
                this.props.navigation.dispatch(resetB);
                alert(responseJson.message);
            } else {
                this.parseData(responseJson.data);
            }
        })
        .catch((error) => {
            console.log(error);
            alert("There was an internal error while connecting! Please restart the app.")
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <TopBar endIcon={false} nav={this.props.navigation} onRef={ref => (this.topBar = ref)} getData={(change) => {
                    var bdate = new Date();
                    bdate.setDate(this.state.beginDate.getDate() + change)
                    var edate = new Date();
                    edate.setDate(this.state.endDate.getDate() + change)
                    this.setState({
                        beginDate: bdate,
                        endDate: edate
                    })
                    this.requestWorkoutList()
                }}
                    
                    plusPress={() => this.setState({selectedWorkout: {}})} />
                <GraphRanges date={() => this.topBar.getDate()} update={(begin) => {
                    this.setState({
                        beginDate: begin,
                    })
                    this.requestWorkoutList()
                }}
                    />
                {Object.keys(this.state.fullData).length === 0 ?
                    <Text style={styles.emptyText}> No Workouts Logged </Text>
                :
                    <View style={{width: WINDOW.width, height: 400}}>
                        <GraphChart data={this.state.graphData}/>
                    </View>
                }
                <View style={styles.wordSet}>
                    <Text style={styles.listTitle}>Workouts</Text>
                    <Text style={styles.listTitle}>Stats</Text>
                </View>
                <View style={styles.listSet}>
                    <FlatList
                    data={this.state.workoutNames}
                    style={{
                        alignSelf: 'flex-start',
                        paddingLeft: 8,
                        flex: 1,
                        borderRadius: 25,
                        height: 150,
                        borderWidth: 1,
                        borderColor: 'silver'
                    }}
                    keyExtractor={(item, index) => item.Name}
                    renderItem={({item}) => {  
                                return <TouchableOpacity onPress={() => {
                                    this.setState({
                                        selectedWorkout: item
                                    })
                                    this.getDataTypes(item.TypeID)
                                    this.requestWorkoutData(item.ExerciseID);
                                }}>
                                <Text style={item.Name == this.state.selectedWorkout.Name ? styles.selectedItem : styles.item}>{item.Name}</Text></TouchableOpacity>}
                        }
                    />
                    <FlatList
                        data={this.state.dataTypes}
                        extraData={this.state.refresh}
                        keyExtractor={(item, index) => item[0]}
                        style={styles.valueSet}
                        renderItem={({item}) => {  
                                return <TouchableOpacity onPress={() => {
                                    this.setGraphData(this.state.selectedWorkout.Name, item[1])
                                    this.setState({
                                        selectedValueSet: item,
                                        refresh: !this.state.refresh
                                    })
                                    this.requestWorkoutData(this.state.selectedWorkout.ExerciseID);
                                }}>
                                <Text style={item[0] == this.state.selectedValueSet[0] ? styles.selectedItem : styles.item}>{item[0]}</Text></TouchableOpacity>}
                        }
                    />
                </View>
            </View>
        );
    }

    getDataTypes = (typeID) => {
        if (typeID == null) return [];
        var types = [["Sets", 1]];
        if (typeID == 0) {
            types.push(["Reps", 2], ["Weight", 3]);
        } else {
            types.push(["Duration", 4], ["Intensity", 5], ["Incline", 6], ["Resistence", 7]);
        }
        this.setState({dataTypes: types});
    }

    setGraphData = (workoutName, index) => {
        var data = [];
        if(this.state.fullData != null) {
            if(this.state.fullData[workoutName] != null) {
                if (index != null && index != undefined) {
                    var setData = this.state.fullData[workoutName];
                    this.state.fullData[workoutName].map(function(item) {
                        var value = item[index]
                        data.push({y: value, marker: value})
                    })
                }
            }
        }
        var returnval = {
            dataSets: [{
              values: data,
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

const resetB = NavigationActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName: 'MainScreen'})],
});

const styles = StyleSheet.create({

    listStyle: {
        alignSelf: 'flex-start',
        paddingLeft: 8,
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 15
    },

    listSet: {
        justifyContent: 'center',
        alignSelf: 'center',
        flexDirection: 'row',
        flex: 1
    },

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

    item: {
        padding: 5,
        fontSize: 16,
        height: 25,
        color: 'silver'
    },

    selectedItem: {
        padding: 5,
        fontSize: 16,
        height: 25,
        color: 'green'
    },

    workoutNames: {
        alignSelf: 'flex-start',
        paddingLeft: 8,
        flex: 1,
        borderRadius: 25,
        height: 150,
        borderWidth: 1,
        borderColor: 'silver'
    },

    valueSet: {
        alignSelf: 'flex-start',
        paddingLeft: 8,
        flex: 1,
        borderRadius: 25,
        height: 150,
        borderWidth: 1,
        borderColor: 'silver'
    },

    wordSet: {
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row'
    },

    listTitle: {
        paddingBottom: 5,
        color: 'silver',
        fontWeight: '200',
        fontSize: 26,
        width: 120,
        textAlign: 'center'
    },

    emptyText: {
        height: 400,
        padding: 20,
        alignSelf: 'center',
    },
});