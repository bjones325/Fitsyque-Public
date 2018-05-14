import React from 'react';
import { Keyboard, Slider, Text, TextField, View, Button, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { NavigationActions } from 'react-navigation';
import WorkoutDetailSelector from '../WorkoutDetailSelector';
import Icon from 'react-native-vector-icons/EvilIcons';
import NetworkCall from "../Network";

// INTEGRATION AND API TEST --- SUPERTEST --- REALWORLD EXAMPLE APP

export default class StrengthScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            Sets: this.props.navigation.getParam('sets', 0),
            Reps: this.props.navigation.getParam('reps', 0),
            Weight: this.props.navigation.getParam('weight', 0),
        };
    }

    pushNewWorkout = () => {
        var call = new NetworkCall();
        call.url = "https://fitsyque.azurewebsites.net/DayList"
        call.type = "post"
        call.body = JSON.stringify({
            Date: this.props.navigation.getParam('date', new Date()).toISOString().substring(0, 10),
            ExerciseID: this.props.navigation.getParam('selectedWorkout', 'null').ExerciseID,
            Sets: this.state.Sets,
            Reps: this.state.Reps,
            Weight: this.state.Weight,
            Duration: 0,
            Intensity: 0,
            Incline: 0,
            Resistence: 0,
            Update: this.props.navigation.getParam('update', 0),
            RecordID: this.props.navigation.getParam('recordID', 0)
        })
        call.onSuccess = (responseJson) => {
            this.props.navigation.pop(this.props.navigation.getParam('numPop', 2))
            this.props.navigation.getParam('callback', null).call();
            //this.props.onClose("success", "Success", "Your workout has been added!");
        }
        call.onFailure = (responseJson) => {
            this.props.navigation.dispatch(resetB);
            alert(responseJson.message);
        }
        call.onError = () => {
            this.props.onClose("error", "Internal Error", "There was an internal error while connecting! Please restart the app.")
        }
        call.execute(true)
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.backButton}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Icon name='arrow-left' style={{
                            fontSize: 36,
                            color: 'silver'
                        }} />
                    </TouchableOpacity >
                </View>
                <View style={{flex: 1, alignItems: 'center',
        justifyContent: 'center'}}>
                    <Text style={{ color: 'silver', paddingTop: 5, fontSize: 22 }}>Set Workout Stats</Text>
                    <Text style={{color: 'silver', paddingTop: 10, fontSize: 16}}> {this.props.navigation.getParam('selectedWorkout', 'null').name}</Text>
                    <Text style={{color: 'silver'}}> Sets: {this.state.Sets} </Text>
                    <Slider style={{width: 200}} value={this.state.Sets} minimumValue={1} maximumValue={5} step={1} onValueChange={(value) => {Keyboard.dismiss(); this.setState({ Sets: value })}}/>
                    <Text style={{color: 'silver'}}> Reps: {this.state.Reps} </Text>
                    <Slider style={{width: 200}} value={this.state.Reps} minimumValue={1} maximumValue={25} step={1} onValueChange={(value) => {Keyboard.dismiss(); this.setState({ Reps: value })}}/>
                    <Text style={{color: 'silver'}}>Weight:</Text>
                    <TextInput
                            borderRadius={25}
                            textAlign={'center'}
                            style={styles.textInput}
                            keyboardType='numeric'
                            placeholder="0"
                            onChangeText={(text) => {
                                this.setState({ Weight: isNaN(parseInt(text)) ? 0 : parseInt(text)})}
                            }
                            value={this.state.Weight.toString()}
                            maxLength={3}
                        />
                    <Button
                        title= {this.props.navigation.getParam('update', 0) == 0 ? "Add Workout" : "Update Workout"}
                        color="green"
                        style={styles.confirmButton}
                        onPress={() => {
                            this.pushNewWorkout();
                            }
                        }
                    />
                </View>
            </View>
        );
    }
}

const resetB = NavigationActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName: 'MainScreen'})],
});

const submit = NavigationActions.reset({
    index: 1,
    actions: [NavigationActions.navigate({routeName: 'MainScreen'}),
        NavigationActions.navigate({routeName: 'WorkoutsMain'})],
});

const styles = StyleSheet.create({

    backButton: {
        alignSelf: 'flex-start',
        paddingTop: 25,
        paddingLeft: 10
    },

    confirmButton: {
        color: 'green',
        borderRadius: 25,
    },

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: 'rgba(0,0,0,0.7)'
    },

    textInput: {
        width: 50,
        height: 35,
        borderColor: 'silver',
        borderRadius: 8,
        borderStyle: 'solid',
        borderWidth: 1,
        color: 'white',
    },
});