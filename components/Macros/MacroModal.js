import React from 'react';
import {Text, TextField, View, Button, TextInput, StyleSheet, FlatList, TouchableOpacity, AsyncStorage} from 'react-native';
import { NavigationActions } from 'react-navigation';

export default class MacroModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            Fat: 0,
            Protein: 0,
            Carb: 0
        };
    }

    pushNewMacro = () => {
        AsyncStorage.getItem('@app:session').then((token) => {
            return fetch('https://fitsyque.azurewebsites.net/Macro', {
                method: "post",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: JSON.stringify({
                    Fat: this.state.Fat,
                    Protein: this.state.Protein,
                    Carb: this.state.Carb,
                    Date: this.props.date().toISOString().substring(0, 10)
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
            this.setState({isVisible: false});
            this.props.onClose("error", "Internal Error", "There was an internal error while connecting! Please restart the app.")
        });
    }

    render() {
            return (
                <View style={styles.modalContainer}>
                <Text style={{paddingTop: 5, fontSize: 18}}>Insert Macro Data</Text>
                <TextInput
                    borderRadius = {25}
                    style={{height: 40}}
                    placeholder="  0  "
                    onChangeText={(text)=> this.setState({Fat: parseInt(text)})}
                    value={this.state.Fat.toString()}
                    maxLength={10}
                />
                <TextInput
                    borderRadius = {25}
                    style={{height: 40}}
                    placeholder="  0  "
                    value = {this.state.Protein}
                    onChangeText={(text)=> this.setState({Protein: parseInt(text)})}
                    value={this.state.Protein.toString()}
                    maxLength={10}
                />
                <TextInput
                    borderRadius = {25}
                    style={{height: 40}}
                    placeholder="  0  "
                    value = {this.state.Carb}
                    onChangeText={(text)=> this.setState({Carb: parseInt(text)})}
                    value={this.state.Carb.toString()}
                    maxLength={10}
                />
                    <Button
                        title="Confirm"
                        color="green"
                        style={styles.confirmButton}
                        onPress={
                            () => {
                                this.pushNewMacro();
                            }
                        }
                    /> 
                </View>   
            );
    }
};

const styles = StyleSheet.create({

    confirmButton: {
        color: 'green',
        borderRadius: 25,
    },

    barView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
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

    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 25,
        height: 450, 
        width: 250,
    }
});
