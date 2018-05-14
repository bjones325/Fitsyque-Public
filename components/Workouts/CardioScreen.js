import React from 'react';
import { Text, View, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationActions } from 'react-navigation';
import WorkoutDetailSelector from '../WorkoutDetailSelector';
import NetworkCall from "../Network";

// INTEGRATION AND API TEST --- SUPERTEST --- REALWORLD EXAMPLE APP

export default class StrengthScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            Sets: this.props.initial.Sets,
            Reps: this.props.initial.Reps,
            Duration: this.props.initial.Duration,
            Intensity: this.props.initial.Intensity,
            Incline: this.props.initial.Incline,
            Resistence: this.props.initial.Resistence
        };
    }

    pushNewWorkout = () => {
        var call = new NetworkCall();
        call.url = "https://fitsyque.azurewebsites.net/DayList"
        call.type = "Post"
        call.body = JSON.stringify({
            Date: this.props.date().toISOString().substring(0, 10),
            ExerciseID: this.props.selectedWorkout.ExerciseID,
            Sets: this.state.Sets,
            Reps: this.state.Reps,
            Weight: 0,
            Duration: this.state.Duration,
            Intensity: this.state.Intensity,
            Incline: this.state.Incline,
            Resistence: this.state.Resistence
        })
        call.onSuccess = (responseJson) => {
            this.props.navigation.pop(1)
            this.props.onClose("success", "Success", "Your workout has been added!");
        }
        call.onFailure = (responseJson) => {
            this.props.navigation.dispatch(resetB);
            alert(responseJson.message);
            //this.dropdown.alertWithType('error', "Error", responseJson.reason);
        }
        call.onError = () => {
            this.props.onClose("error", "Internal Error", "There was an internal error while connecting! Please restart the app.")
        }
        call.execute(true);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={{ paddingTop: 5, fontSize: 18 }}>Set Workout Stats</Text>
                <Text style={{paddingTop: 10, fontSize: 16}}> {this.props.selectedWorkout.name}</Text>
                <WorkoutDetailSelector text="Reps" getValue={this.state.Reps} updateValue={(value) => { this.setState({ Reps: value }) }} />
                <WorkoutDetailSelector text="Duration" getValue={this.state.Duration} updateValue={(value) => { this.setState({ Duration: value }) }} />
                <WorkoutDetailSelector text="Intensity" getValue={this.state.Intensity} updateValue={(value) => { this.setState({ Intensity: value }) }} />
                <WorkoutDetailSelector text="Incline" getValue={this.state.Incline} updateValue={(value) => { this.setState({ Incline: value }) }} />
                <WorkoutDetailSelector text="Resistence" getValue={this.state.Resistence} updateValue={(value) => { this.setState({ Resistence: value }) }} />
                <Button
                    title="Confirm"
                    color="green"
                    style={styles.confirmButton}
                    onPress={
                        () => {
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
        paddingTop: 20
    },

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});