import React from 'react';
import {FlatList, Text, Platform, Dimensions, StyleSheet, TouchableOpacity, View, AsyncStorage, processColor} from 'react-native';
import { NavigationActions } from 'react-navigation';
import TopBar from '../TopBar';
import Modal from "react-native-modal";
import DropdownAlert from 'react-native-dropdownalert';
import GraphChart from './GraphChart';
const WINDOW = Dimensions.get('window')


export default class GraphScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            selectedWorkout: {},
            selectedValueSet: [],
            date: new Date(),
            data: [],
            parsedData: [],
            workoutNames: [],
            fullData: []
        }
        this.requestWorkoutList(new Date());
        this.requestWorkoutData(new Date());
    }

    requestWorkoutList = (date) => {
        AsyncStorage.getItem('@app:session').then((token) => {
            return fetch('https://fitsyque.azurewebsites.net/Graph/WorkoutList', {
                method: "get",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token,
                    date: date.toISOString().substring(0, 10)
                }
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if(!responseJson.success) {
                this.props.navigation.dispatch(resetB);
                alert(responseJson.message);
            } else {
                this.setState({workoutNames: responseJson.data});
            }
        })
        .catch((error) => {
            console.log(error);
            this.setState({isVisible: false});
            alert("There was an internal error while connecting! Please restart the app.")
        });
    }

    requestWorkoutData = (date) => {
        console.log("D:" + date);
        AsyncStorage.getItem('@app:session').then((token) => {
            return fetch('https://fitsyque.azurewebsites.net/Graph/Data', {
                method: "get",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token,
                    date: date.toISOString().substring(0, 10)
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
            this.setState({isVisible: false});
            alert("There was an internal error while connecting! Please restart the app.")
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <TopBar nav={this.props.navigation} onRef={ref => (this.topBar = ref)} getData={(date) => {
                    this.requestWorkoutData(date);
                    this.requestWorkoutList(date);
                    this.setState({
                        selectedWorkout: {},
                        selectedValueSet: []
                    })
                }}
                    plusPress={() => this.setState({isVisible: true, selectedWorkout: {}, searchInput: ""})} />
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
                        borderWidth: 1
                    }}
                    keyExtractor={(item, index) => item.Name}
                    renderItem={({item}) => {  
                                return <TouchableOpacity onPress={() => {
                                    this.setState({
                                        selectedWorkout: item
                                    })
                                }}>
                                <Text style={item.Name == this.state.selectedWorkout.Name ? styles.selectedItem : styles.item}>{item.Name}</Text></TouchableOpacity>}
                        }
                    />
                    <FlatList
                        data={this.getDataTypes(this.state.selectedWorkout.TypeID)}
                        keyExtractor={(item, index) => item[0]}
                        style={styles.valueSet}
                        renderItem={({item}) => {  
                                return <TouchableOpacity onPress={() => {
                                    this.setState({
                                        selectedValueSet: item
                                    })
                                    this.getDataSet(this.state.selectedWorkout.Name, item[1])
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
        return types;
    }

    getDataSet = (workoutName, index) => {
        var data = [];
        if(this.state.fullData != null) {
            if(this.state.fullData[workoutName] != null) {
                if (index != null && index != undefined) {
                    var setData = this.state.fullData[workoutName];
                    this.state.fullData[workoutName].map(function(item) {
                        data.push({y: item[index]})
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
                drawCircles: false,
                highlightColor: processColor('red'),
                color: processColor('red'),
                drawFilled: false,
                fillColor: processColor('black'),
                fillAlpha: 60,
                    valueTextSize: 15,
                valueFormatter: "##.000",
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
        var result = Object.keys(sections).map(function(key) {
            return [key, sections[key]];
        });
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
    },

    selectedItem: {
        padding: 5,
        fontSize: 16,
        height: 25,
        color: 'green'
    },

    valueSet: {
        alignSelf: 'flex-start',
        paddingLeft: 8,
        borderRadius: 25,
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: 1,
        height: 150,
        flex: 1
    },

    wordSet: {
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row'
    },

    listTitle: {
        paddingBottom: 5,
        color: 'black', //#841584
        fontWeight: '200',
        fontSize: 26,
        width: 120,
        textAlign: 'center'
    },

    emptyText: {
        height: 400,
        padding: 20,
        alignSelf: 'center',
    }
});