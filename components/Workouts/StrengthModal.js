import React from 'react';
import { Text, TextField, View, Button, TextInput, StyleSheet, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';
import WorkoutDetailSelector from '../WorkoutDetailSelector';

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
        AsyncStorage.getItem('@app:session').then((token) => {
            return fetch('https://fitsyque.azurewebsites.net/DayList', {
                method: "post",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: JSON.stringify({
                    Date: this.props.date().toISOString().substring(0, 10),
                    ExerciseID: this.props.selectedWorkout.ExerciseID,
                    Sets: this.state.Sets,
                    Reps: this.state.Reps,
                    Weight: this.state.Weight,
                    Duration: 0,
                    Intensity: 0,
                    Incline: 0,
                    Resistence: 0
                })
            })
        })
            .then((response) =>
                response.json()
            )
            .then((responseJson) => {
                if (!responseJson.success) {
                    this.props.navigation.dispatch(resetB);
                    alert(responseJson.message);
                } else {
                    this.props.onClose("success", "Success", "Your workout has been added!");
                }
            })
            .catch((error) => {
                console.log(error);
                console.log(responseJson);
                this.setState({ isVisible: false });
                this.props.onClose("error", "Internal Error", "There was an internal error while connecting! Please restart the app.")
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={{ paddingTop: 5, fontSize: 22 }}>Set Workout Stats</Text>
                <WorkoutDetailSelector text="Reps" getValue={this.state.Reps} updateValue={(value) => { this.setState({ Reps: value }) }} />
                <WorkoutDetailSelector text="Sets" getValue={this.state.Sets} updateValue={(value) => { this.setState({ Sets: value }) }} />
                <WorkoutDetailSelector text="Weight" getValue={this.state.Weight} updateValue={(value) => { this.setState({ Weight: value }) }} />
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
    }
});