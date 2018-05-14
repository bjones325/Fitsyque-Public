import React from 'react';
import { Text, TextField, View, Button, TextInput, StyleSheet, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import WorkoutDetailSelector from '../WorkoutDetailSelector';
import Icon from 'react-native-vector-icons/EvilIcons';
import NetworkCall from "../Network";

// INTEGRATION AND API TEST --- SUPERTEST --- REALWORLD EXAMPLE APP

export default class WorkoutListScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedWorkout: {},
            searchInput: "",
            data: [],
        };
        this.requestWorkoutData();
    }

    requestWorkoutData = () => {
        var call = new NetworkCall();
        call.url = "https://fitsyque.azurewebsites.net/WorkoutList"
        call.type = "get"
        call.onSuccess = (responseJson) => {
            this.setState({ data: responseJson.data });
        }
        call.onFailure = (responseJson) => {
            this.props.navigation.dispatch(resetB);
            alert(responseJson.message);
        }
        call.onError = () => {
            alert("There was an internal error while connecting! Please restart the app.")
        }

        call.execute(true)
    }

    render() {
        return (
            <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', backgroundColor: 'rgba(0,0,0,0.7)' }}>
                <View style={styles.backButton}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Icon name='arrow-left' style={{
                            fontSize: 36,
                            color: 'silver'
                        }} />
                    </TouchableOpacity >
                </View>
                <View style={{ flex: 1, alignItems: 'center', flexDirection: 'column' }}>
                    <Text style={{ paddingTop: 10, fontSize: 28, color: 'silver' }}>Add a Workout</Text>
                    <Text style={{ paddingTop: 5, fontSize: 20, color: 'silver' }}> Choose from {this.state.data.length} unique workouts </Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="search" style={{ fontSize: 24, color: 'silver' }} />
                    <TextInput
                        borderRadius={25}
                        placeholder="Workout Name"
                        placeholderTextColor='silver'
                        style={{ height: 40, width: 100, color: 'silver' }}
                        onChangeText={(text) => this.setState({ searchInput: text })}
                    />
                </View>
                <View style={{flex: 6}}>
                    <FlatList
                        style={styles.list}
                        data={this.state.data.filter(item => item.Name.includes(this.state.searchInput))}
                        keyExtractor={(item, index) => item.Name}
                        renderItem={({ item }) => {
                            return <TouchableOpacity onPress={() => { this.setState({ selectedWorkout: { name: item.Name, TypeID: item.TypeID, ExerciseID: item.ExerciseID } }) }}
                            ><Text style={item.Name == this.state.selectedWorkout.name ? styles.selectedItem : styles.item}>{item.Name}</Text></TouchableOpacity>
                        }
                        }
                    />
                </View>
                <Button
                    title="Next"
                    color="green"
                    style={styles.confirmButton}
                    onPress={() => {
                        if (this.state.selectedWorkout.TypeID == 0) {
                            this.props.navigation.navigate("StrengthScreen",
                            {
                                selectedWorkout: this.state.selectedWorkout,
                                sets: 1,
                                reps: 1,
                                weight: 0,
                                date: this.props.navigation.getParam('date', new Date())
                            }
                        )
                        } else {
                            this.props.navigation.navigate("CardioScreen")
                        }
                    }
                    }
                />
            </View>
        );
    }
}

const resetB = NavigationActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'MainScreen' })],
});

const styles = StyleSheet.create({

    backButton: {
        alignSelf: 'flex-start',
        paddingTop: 25,
        paddingLeft: 10
    },

    confirmButton: {
        flex: 1,
        color: 'green',
        borderRadius: 25,
        fontSize: 28
    },

    item: {
        padding: 8,
        fontSize: 20,
        color: 'silver'
    },

    selectedItem: {
        padding: 8,
        fontSize: 20,
        color: 'green'
    },

    list: {
        flex: 3
    }
});