import React from 'react';
import { Text, View, Button, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/EvilIcons';
import NetworkCall from '../Network';

export default class AddMacro extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Fat:  this.props.navigation.getParam('fat', 0),
            Protein: this.props.navigation.getParam('protein', 0),
            Carb: this.props.navigation.getParam('carb', 0)
        };
    }

    pushNewMacro = () => {
        var call = new NetworkCall();
        call.url = "https://fitsyque.azurewebsites.net/Macro"
        call.type = "post"
        call.body = JSON.stringify({
            Date: this.props.navigation.getParam('date', new Date()).toISOString().substring(0, 10),
            Update: this.props.navigation.getParam('update', 0),
            RecordID: this.props.navigation.getParam('recordID', 0),
            Fat: this.state.Fat,
            Protein: this.state.Protein,
            Carb: this.state.Carb
        })
        call.onSuccess = () => {
            this.props.navigation.dispatch(resetB);
        }
        call.onError = () => {
            console.log(error);
            this.props.onClose("error", "Internal Error", "There was an internal error while connecting! Please restart the app.")
        }
        call.execute(true);
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
                    <KeyboardAvoidingView style={{
                        flex: 1,
                        justifyContent: 'center',
                    }} behavior="position" keyboardVerticalOffset={-100} enabled>
                    <View style={styles.buttons}>
                        <Text style={{fontSize: 24, fontWeight: '600', color: 'silver', justifyContent: 'center' }}>Insert Macronutrient Data</Text>
                        <Text style={styles.text}>Fat</Text>
                        <TextInput
                            borderRadius={25}
                            textAlign={'center'}
                            style={styles.textInput}
                            keyboardType='numeric'
                            placeholder="0"
                            onChangeText={(text) => {
                                this.setState({ Fat: isNaN(parseInt(text)) ? 0 : parseInt(text)})}
                            }
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
                            onChangeText={(text) => this.setState({ Protein: isNaN(parseInt(text)) ? 0 : parseInt(text) })}
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
                            onChangeText={(text) => this.setState({ Carb: isNaN(parseInt(text)) ? 0 : parseInt(text) })}
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
                    </KeyboardAvoidingView>
            </View>
        );
    }
};

const resetB = NavigationActions.reset({
    index: 1,
    actions: [NavigationActions.navigate({routeName: 'MainScreen'}),
        NavigationActions.navigate({routeName: 'MacronutrientMain'})],
});

const styles = StyleSheet.create({

    backButton: {
        alignSelf: 'flex-start',
        paddingTop: 25,
        paddingLeft: 10
    },

    confirmButton: {
        color: 'green',
        paddingTop: 40
    },

    buttons: {
        flex: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },

    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)'
    },

    textInput: {
        width: 50,
        height: 35,
        borderColor: 'silver',
        borderRadius: 8,
        borderStyle: 'solid',
        borderWidth: 1,
        color: 'black'
    },

    text: {
        fontWeight: '300',
        fontSize: 20,
        paddingTop: 20,
        paddingBottom: 5,
        color: 'silver'
    }
});
