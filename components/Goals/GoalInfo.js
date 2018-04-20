import React from 'react';
import { Text, Platform, Dimensions, StyleSheet, View, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/EvilIcons';
import DropdownAlert from 'react-native-dropdownalert';
const WINDOW = Dimensions.get('window')


export default class GoalInfo extends React.Component {
    constructor(props) {
        super(props);
        this.requestGoalData();
        this.state = {
            fixes: []
        }
    }

    requestGoalData = () => {
        AsyncStorage.getItem('@app:session').then((token) => {
            return fetch('https://fitsyque.azurewebsites.net/Goal', {
                method: "get",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token,
                    date: (new Date()).toISOString().substring(0, 10)
                }
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if(!responseJson.success) {
                alert(responseJson.message);
            } else {
                this.setState({data: responseJson.data});
                this.generateChange(this.props.goalType)
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    generateChange = (goal) => {
        var fixes = [];
        console.log(goal);
        switch(goal) {
            case "Increase Mass":
                var reps = 0;
                for(var i = 0; i < this.state.data.length; i++) {
                    reps += this.state.data[i].Reps;
                }
                reps /= this.state.data.length;
                if (reps > 14) {
                    fixes.push({Key: 1, Text: "Decrease Rep Values by " + ((reps - 14) / 14).toFixed(1)})
                }
                if (reps < 6) {
                    fixes.push({Key: 1, Text: "Increase Rep Values by " + ((6 - reps) / 6).toFixed(1)})
                }
                break;
            case "Strength":
                var reps = 0;
                for(var i = 0; i < this.state.data.length; i++) {
                    reps += this.state.data[i].Reps;
                }
                reps /= this.state.data.length;
                if (reps > 8) {
                    fixes.push({Key: 1, Text: "Decrease Rep Values by " + ((reps - 8) / 8).toFixed(1)})
                }
                if (reps < 4) {
                    fixes.push({Key: 1, Text: "Increase Rep Values by " + ((4 - reps) / 4).toFixed(1)})
                }
                break;
            case "Tone":
                var reps = 0;
                var weight = 0;
                for(var i = 0; i < this.state.data.length; i++) {
                    reps += this.state.data[i].Reps;
                    weight += this.state.data[i].Weight;
                }
                reps /= this.state.data.length;
                weight /= this.state.data.length;
                if (reps > 20) {
                    fixes.push({Key: 1, Text: "Decrease Rep Values by " + ((reps - 20) / 20).toFixed(1)})
                }
                if (reps < 12) {
                    fixes.push({Key: 1, Text: "Increase Rep Values by " + ((12 - reps) / 12).toFixed(1)})
                }
                if (weight > 20) {
                    fixes.push({Key: 1, Text: "Decrease Weight Values by " + ((weight - 20) / 20).toFixed(1)})
                }
                break;
            case "Cut":
                var reps = 0;
                var TypeID = 0;
                for(var i = 0; i < this.state.data.length; i++) {
                    reps += this.state.data[i].Reps;
                    TypeID += this.state.data[i].TypeID;
                }
                reps /= this.state.data.length;
                if (reps > 20) {
                    fixes.push({Key: 1, Text: "Decrease Rep Values by " + ((reps - 20) / 20).toFixed(1)})
                }
                if (reps < 12) {
                    fixes.push({Key: 1, Text: "Increase Rep Values by " + ((12 - reps) / 12).toFixed(1)})
                }   
                if (weight > 20) {
                    fixes.push({Key: 1, Text: "Decrease Weight Values by " + ((weight - 20) / 20).toFixed(1)})
                }
                if (TypeID < (this.state.data.length/2)) {
                    fixes.push({Key: 1, Text: "Increase Cardio Exercises to atleast once every other day"});
                }  
                break;
            case "Endurance":
                var reps = 0;
                for(var i = 0; i < this.state.data.length; i++) {
                    reps += this.state.data[i].Reps;
                }
                reps /= this.state.data.length;
                if (reps < 18) {
                    fixes.push({Key: 1, Text: "Increase Rep Values by " + ((18 - reps) / 18).toFixed(0)})
                }
                if (weight > 25) {
                    fixes.push({Key: 1, Text: "Decrease Weight Values by " + ((weight - 25) / 25).toFixed(0)})
                }
                if (TypeID < (this.state.data.length/3)) {
                    fixes.push({Key: 1, Text: "Increase Cardio Exercises to atleast once every 3 days"});
                }  
                break;
        }
        return fixes;
        //this.setState({fixes: fixes});
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>To achieve your goal of {this.props.goalType}, you should: </Text>
                {this.generateChange(this.props.goalType).length != 0 ?
                <FlatList
                    data={this.generateChange(this.props.goalType)}
                    scrollEnabled={false}
                    renderItem={({item}) => <Text style={styles.textCell}>{item.Text}</Text>}
                /> :
                <Text style={{textAlign: 'center'}}>Continue your current workout routine</Text>}
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

    textCell: {
        fontWeight: 'bold',
        fontSize: 14,
        paddingLeft: 10,
        paddingVertical: 3
    },

    container: {
        flex: 1,
    },

    modalContainer: {
        backgroundColor: "white",
        padding: 22,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)"
    },

    item: {
        paddingVertical: 5,
        fontSize: 16,
        height: 26,
    },

    selectedItem: {
        paddingVertical: 5,
        fontSize: 16,
        height: 26,
        color: 'green'
    },

    backButton: {
        alignSelf: 'flex-start',
        paddingTop: 25,
        paddingLeft: 10
    },

    goalList: {
        justifyContent: "center",
        alignItems: "center",
        height: 160
    }
});