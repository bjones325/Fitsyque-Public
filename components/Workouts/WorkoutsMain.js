import React from 'react';
import { Text, Platform, Dimensions, StyleSheet, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { StackNavigator } from 'react-navigation';
import DaySchedule from './DaySchedule';
import TopBar from "../TopBar";
import DropdownAlert from 'react-native-dropdownalert';
const WINDOW = Dimensions.get('window')


export default class WorkoutsMain extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <TopBar
                    endIcon={true}
                    nav={this.props.navigation}
                    onRef={ref => (this.topBar = ref)}
                    getData={(date) => this.child.requestWorkoutData(date)}
                    plusPress={() => {
                        this.props.navigation.navigate("WorkoutListScreen", {
                            date: this.topBar.getDate()
                        });
                    }}
                />
                <DaySchedule
                    onRef={ref => (this.child = ref)}
                    date={() => this.topBar.getDate()}
                    openModal={(data, update) => {
                        var destination = (data[0] == 0 ? "StrengthScreen" : "CardioScreen");
                        this.props.navigation.navigate(destination, {
                            date: this.topBar.getDate(),
                            sets: data[1],
                            reps: data[2],
                            weight: data[3],
                            duration: data[4],
                            intensity: data[5],
                            incline: data[6],
                            resistence: data[7],
                            selectedWorkout: {
                                name: data[10],
                                ExerciseID: data[8]
                            },
                            update: update,
                            recordID: data[9]
                        });
                    }}
                />
                <DropdownAlert defaultContainer={{ flex: 2, padding: 8, paddingTop: Platform.OS === 'android' ? 0 : 10, flexDirection: 'row' }}
                    ref={ref => this.dropdown = ref} startDelta={WINDOW.height + 200} endDelta={WINDOW.height} />
            </View>
        );
    }
};

const styles = StyleSheet.create({
    text: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 18,
    },

    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)'
    },

    modalContainer: {
        backgroundColor: "white",
        padding: 22,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)"
      },
});