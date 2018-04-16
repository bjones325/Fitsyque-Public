import React from 'react';
import {Text, TextField, View, Button, TextInput, StyleSheet, FlatList, TouchableOpacity, AsyncStorage} from 'react-native';
import { NavigationActions } from 'react-navigation';
import WorkoutDetailSelector from '../WorkoutDetailSelector';

// INTEGRATION AND API TEST --- SUPERTEST --- REALWORLD EXAMPLE APP

export default class WorkoutListModal extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            selectedWorkout: {},
            searchInput: "",
            data: [],
        };
        this.requestWorkoutData();
    }

    requestWorkoutData = () => {
        AsyncStorage.getItem('@app:session').then((token) => {
            return fetch('https://fitsyque.azurewebsites.net/WorkoutList', {
                method: "get",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                }
            })
        })
        .then((response) => 
            response.json())
        .then((responseJson) => {
            if (!responseJson.success) {
                alert("There was an error connecting to the server! Please try later.");
                return;
            }
            this.setState({data: responseJson.data});
        })
        .catch((error) => {
            console.log(error);
            console.log(responseJson);
            alert("There was an internal error while connecting! Please restart the app.")
        });
    }

    render() {
        return(
        <View style={{flex: 1, justifyContent: 'center', alignItems:'center'}}>
            <Text style={{paddingTop: 5, fontSize: 22}}>Add a Workout</Text>
            <TextInput
                borderRadius = {25}
                placeholder="Workout Name"
                style={{height: 40}}
                onChangeText={(text) => this.setState({searchInput: text})}
            />
            <FlatList
                data={this.state.data.filter(item => item.Name.includes(this.state.searchInput))}
                style = {{alignSelf: 'flex-start', paddingLeft: 8}}
                keyExtractor={(item, index) => item.Name}
                renderItem={({item}) => {  
                        return <TouchableOpacity onPress={() => {this.setState({selectedWorkout: {name: item.Name, TypeID: item.TypeID, ExerciseID: item.ExerciseID}})}}
                        ><Text style={item.Name == this.state.selectedWorkout.name ? styles.selectedItem : styles.item}>{item.Name}</Text></TouchableOpacity>}
                }
                />
                <Button
                    title="Next"
                    color="green"
                    style={styles.confirmButton}
                    onPress={() => this.props.next(this.state.selectedWorkout)}
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

    item: {
        paddingVertical: 7,
        fontSize: 16,
        height: 26,
    },

    selectedItem: {
        paddingVertical: 7,
        fontSize: 16,
        height: 26,
        color: 'green'
    },
});