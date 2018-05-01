import React from 'react';
import { Keyboard, Slider, Text, TextField, View, Button, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { NavigationActions } from 'react-navigation';
import WorkoutDetailSelector from '../WorkoutDetailSelector';
import Network from "../Network";

// INTEGRATION AND API TEST --- SUPERTEST --- REALWORLD EXAMPLE APP

export default class StrengthModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            Sets: this.props.initial.Sets,
            Reps: this.props.initial.Reps,
            Weight: this.props.initial.Weight,
        };
    }

    pushNewWorkout = () => {
        Network.authCall("https://fitsyque.azurewebsites.net/DayList", "post",
            null,
            JSON.stringify({
                Date: this.props.date().toISOString().substring(0, 10),
                ExerciseID: this.props.selectedWorkout.ExerciseID,
                Sets: this.state.Sets,
                Reps: this.state.Reps,
                Weight: this.state.Weight,
                Duration: 0,
                Intensity: 0,
                Incline: 0,
                Resistence: 0
            }),
            (responseJson) => {
                this.props.onClose("success", "Success", "Your workout has been added!");
            },
            (responseJson) => {
                this.props.navigation.dispatch(resetB);
                alert(responseJson.message);
            },
            () => {
                this.props.onClose("error", "Internal Error", "There was an internal error while connecting! Please restart the app.")
            },
            () => {
                this.setState({ isVisible: false });
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={{ paddingTop: 5, fontSize: 22 }}>Set Workout Stats</Text>
                <Text style={{paddingTop: 10, fontSize: 16}}> {this.props.selectedWorkout.name}</Text>
                <Text> Sets: {this.state.Sets} </Text>
                <Slider style={{width: 200}} value={this.props.initial.Sets} minimumValue={1} maximumValue={5} step={1} onValueChange={(value) => {Keyboard.dismiss(); this.setState({ Sets: value })}}/>
                <Text> Reps: {this.state.Reps} </Text>
                <Slider style={{width: 200}} value={this.props.initial.Reps} minimumValue={1} maximumValue={25} step={1} onValueChange={(value) => {Keyboard.dismiss(); this.setState({ Reps: value })}}/>
                <Text>Weight:</Text>
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
                    title="Confirm"
                    color="green"
                    style={styles.confirmButton}
                    onPress={() => {
                        this.pushNewWorkout();
                    }
                    }
                />
            </View>
        );
    }
}

const resetB = NavigationActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName: 'MainScreen'})],
});

const styles = StyleSheet.create({
    confirmButton: {
        color: 'green',
        borderRadius: 25,
    },

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    textInput: {
        width: 50,
        height: 35,
        borderColor: 'black',
        borderRadius: 8,
        borderStyle: 'solid',
        borderWidth: 1,
        color: 'black'
    },
});