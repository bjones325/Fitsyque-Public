import React from 'react';
import {FlatList, Text, Platform, Dimensions, StyleSheet, TouchableOpacity, View, AsyncStorage, processColor} from 'react-native';
import NetworkCall from '../Network';

export default class GraphLists extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedWorkout: {},
            selectedValueSet: "",
            workoutNames: [],
            dataTypes: [],
            refresh: true
        }
        this.requestWorkoutList();
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    requestWorkoutList = () => {
        var call = new NetworkCall();
        call.url = "https://fitsyque.azurewebsites.net/Graph/WorkoutList"
        call.type = "get"
        call.extraHeaders = {
            beginDate: this.props.beginDate.toISOString().substring(0, 10),
            endDate: this.props.endDate.toISOString().substring(0, 10),
        }
        call.onSuccess = (responseJson) => {
            this.setState({
                workoutNames: responseJson.data,
                selectedWorkout: {},
                selectedValueSet: "",
                dataTypes: [],
                refresh: !this.state.refresh,
            });
            this.props.setData([])
        }
        call.onFailure = (responseJson) => {
            alert(responseJson.message);
        }
        call.onError = (error) => {
            console.log(error);
            alert("There was an internal error while connecting! Please restart the app.")
        }
        call.execute(true);
    }

    requestWorkoutData = (exerciseID, valueSet) => {
        var call = new NetworkCall();
        call.url = ("https://fitsyque.azurewebsites.net/Graph/Data/" + valueSet)
        call.type = "get"
        call.extraHeaders = {
            beginDate: this.props.beginDate.toISOString().substring(0, 10),
            endDate: this.props.endDate.toISOString().substring(0, 10),
            ExerciseID: exerciseID
        }
        call.onSuccess = (responseJson) => {
            this.props.setData(responseJson.data)
        }
        call.onFailure = (responseJson) => {
            //this.props.navigation.dispatch(resetB);
            alert(responseJson.message);
        }
        call.onError = (error) => {
            console.log(error);
            alert("There was an internal error while connecting! Please restart the app.")
        }
        call.execute(true);
    }

    render() {
        return (
            <View>
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
                        borderColor: 'silver',
                        overflow: 'hidden'
                    }}
                    keyExtractor={(item, index) => item.Name}
                    renderItem={({item}) => {  
                                return <TouchableOpacity onPress={() => {
                                    var types = this.getDataTypes(item.TypeID)
                                    this.setState({
                                        selectedWorkout: item,
                                        dataTypes: types,
                                        selectedValueSet: types[0],
                                        refresh: !this.state.refresh
                                    })
                                    this.requestWorkoutData(item.ExerciseID, types[0]);
                                }}>
                                <Text style={item.Name == this.state.selectedWorkout.Name ? styles.selectedItem : styles.item}>{item.Name}</Text></TouchableOpacity>}
                        }
                    />
                    <FlatList
                        data={this.state.dataTypes}
                        extraData={this.state.refresh}
                        keyExtractor={(item, index) => item}
                        style={styles.valueSet}
                        renderItem={({item}) => {  
                                return <TouchableOpacity onPress={() => {
                                    this.setState({
                                        selectedValueSet: item,
                                        refresh: !this.state.refresh
                                    })
                                    this.requestWorkoutData(this.state.selectedWorkout.ExerciseID, item);
                                }}>
                                <Text style={item == this.state.selectedValueSet? styles.selectedItem : styles.item}>{item.replace("_", " ")}</Text></TouchableOpacity>}
                        }
                    />
                </View>
            </View>
        );
    }

    getDataTypes = (typeID) => {
        if (typeID == null) return [];
        var types = [];
        if (typeID == 0) {
            types.push("Max_Weight", "Min_Weight", "Average_Weight", "Average_Reps", "Total_Weight", "Total_Reps");
        } else {
            types.push(["Duration", 4], ["Intensity", 5], ["Incline", 6], ["Resistence", 7]);
        }
        return types
    }
}



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
        flex: 1,
        paddingHorizontal: 5,
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
        borderColor: 'silver',
        overflow: 'hidden'
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
})