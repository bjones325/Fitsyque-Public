import React from 'react';
import {FlatList, Text, Platform, Dimensions, StyleSheet, TouchableOpacity, View, AsyncStorage} from 'react-native';
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
                <TopBar nav={this.props.navigation} onRef={ref => (this.topBar = ref)} getData={(date) => this.requestWorkoutData(date)}
                    plusPress={() => this.setState({isVisible: true, selectedWorkout: {}, searchInput: ""})} />
                <View>
                    <GraphChart data={this.getDataSet(this.state.selectedWorkout.Name, this.state.selectedValueSet[1])}/>
                </View>
                <View style={styles.listSet}>
                    <FlatList
                    data={this.state.workoutNames}
                    style = {{alignSelf: 'flex-start', paddingLeft: 8}}
                    keyExtractor={(item, index) => item.Name}
                    renderItem={({item}) => {  
                            return <TouchableOpacity onPress={() => {
                                this.setState({selectedWorkout: item})
                            }}>
                            <Text style={item.Name == this.state.selectedWorkout.Name ? styles.selectedItem : styles.item}>{item.Name}</Text></TouchableOpacity>}
                    }
                    />
                    <FlatList
                        data={this.getDataTypes(this.state.selectedWorkout.TypeID)}
                        keyExtractor={(item, index) => item}
                        renderItem={({item}) => {  
                                return <TouchableOpacity onPress={() => {
                                    this.setState({
                                        selectedValueSet: item
                                    })
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
        if(this.state.fullData == null) return [];
        if(this.state.fullData[workoutName] == null) return [];
        if (index == null | index == undefined) return [];
        var setData = this.state.fullData[workoutName];
        this.state.fullData[workoutName].map(function(item) {
            data.push(item[index])
        })
        console.log(data);
        return data;
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
        height: 26,
    },

    selectedItem: {
        padding: 5,
        fontSize: 16,
        height: 26,
        color: 'green'
    },
});