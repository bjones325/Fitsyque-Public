import React from 'react';
import { Text, TextField, View, Button, TextInput, StyleSheet, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';

export default class MacroModal extends React.Component {
    constructor(props) {
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
                    this.props.onClose("success", "Success", "Your macronutrients has been added!");
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
            <View style={styles.modalContainer}>
                <Text style={{ paddingTop: 10, fontSize: 24, paddingBottom: 30, fontWeight: '600' }}>Insert Macro Data</Text>
                <View style={styles.buttons}>
                    <Text style={styles.text}>Fat</Text>
                    <TextInput
                        borderRadius={25}
                        textAlign={'center'}
                        style={styles.textInput}
                        keyboardType='numeric'
                        placeholder="0"
                        onChangeText={(text) => this.setState({ Fat: parseInt(text) })}
                        value={this.state.Fat.toString()}
                        maxLength={3}
                    />
                    <Text style={styles.text}>Protein</Text>
                    <TextInput
                        borderRadius={25}
                        textAlign={'center'}
                        style={styles.textInput}
                        keyboardType='numeric'
                        placeholder="0"
                        value={this.state.Protein}
                        onChangeText={(text) => this.setState({ Protein: parseInt(text) })}
                        value={this.state.Protein.toString()}
                        maxLength={3}
                    />
                    <Text style={styles.text}>Carbs</Text>
                    <TextInput
                        borderRadius={25}
                        textAlign={'center'}
                        style={styles.textInput}
                        placeholder="0"
                        keyboardType='numeric'
                        value={this.state.Carb}
                        onChangeText={(text) => this.setState({ Carb: parseInt(text) })}
                        value={this.state.Carb.toString()}
                        maxLength={3}
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
            </View>
        );
    }
};

const styles = StyleSheet.create({

    confirmButton: {
        color: 'green',
        paddingTop: 40
    },

    barView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },

    buttons: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,
        paddingBottom: 70
    },

    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: 'white',
        borderRadius: 25,
        height: 400,
        width: 250,
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

    text: {
        fontWeight: '300',
        fontSize: 20,
        paddingTop: 20,
        paddingBottom: 5
    }
});
