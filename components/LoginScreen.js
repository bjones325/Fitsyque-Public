import React from 'react';
import {TouchableOpacity, ImageBackground, Platform, Dimensions, Text, View, Button, TextInput, StyleSheet, AsyncStorage} from 'react-native';
import { NavigationActions } from 'react-navigation';
import DropdownAlert from 'react-native-dropdownalert';
import Icon from 'react-native-vector-icons/EvilIcons';
var Spinner = require('react-native-spinkit');
const WINDOW = Dimensions.get('window')

export default class LoginScreen extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            username: "",
            password: "",
            visibleAnimation: false};
    }

    login = () => {
        this.setState({visibleAnimation: true});
        fetch('https://fitsyque.azurewebsites.net/Login', {
            method: "post",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                login: this.state.username,
                password: this.state.password
            })
        })
        .then((response) => 
            response.json())
        .then((responseJson) => {
            if(responseJson.success) {
                AsyncStorage.setItem('@app:session', responseJson.token);
                this.props.navigation.dispatch(resetMain);
            } else if (responseJson.reason === 'Invalid Inputs' || 
                responseJson.reason === "Incorrect password" ||
                responseJson.reason === "Non-valid username") {
                this.dropdown.alertWithType('error', "Error", responseJson.reason);
            } else {
                this.dropdown.alertWithType('error', "Error", "There was a networking error. Please try later!");
            }
            this.setState({visibleAnimation: false});
        })
        .catch((error) => {
            console.log(error);
            console.log(responseJson);
            this.setState({visibleAnimation: false});
            alert("There was an internal error while connecting! Please restart the app.")
        });
    }

    render() {
        return (
            <ImageBackground
            style={{
                flex: 1,
                position: 'absolute',
                width: '100%',
                height: '100%',
                justifyContent: 'center',
            }}
            source={require("../Assets/jump.jpg")}
            >
                <View style = {styles.background}>
                    <TouchableOpacity style = {styles.backButton} onPress={() => this.props.navigation.goBack()}>
                        <Icon name='arrow-left' style={{ fontSize: 36, color: 'silver' }} />
                    </TouchableOpacity >
                    <Text style={styles.titleText}>
                           Login to begin today's workout
                    </Text>
                    <View style={styles.buttons}>
                        <View style={{flex: 5, alignItems: 'center'}}>
                            <Text style={styles.text}>
                                Username
                            </Text>
                            <TextInput onChangeText={(text) => this.setState({username: text})}
                                style = {styles.textBox}/>
                            <Text style={styles.text}>
                                Password
                            </Text>
                            <TextInput onChangeText={(text) => this.setState({password: text})} 
                                style = {styles.textBox}/>
                            <Button title="Login" onPress={this.login} />
                            <View>
                                <Spinner isVisible={this.state.visibleAnimation} size={40} type={"ThreeBounce"} color={"#FF0000"}/>
                            </View>
                        </View>
                    </View>
                </View>
                <DropdownAlert     defaultContainer={{ padding: 8, paddingTop: Platform.OS === 'android' ? 0 : 10, flexDirection: 'row' }}
                ref={ref => this.dropdown = ref} startDelta={WINDOW.height + 200} endDelta={WINDOW.height}/>
            </ImageBackground>
        );
    }
};

resetMain = NavigationActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName: 'MainScreen'})],
});

const styles = StyleSheet.create({
    background: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)'
    },

    textBox: {
        width: 175,
        borderColor: 'red',
        borderRadius: 25,
        borderStyle: 'solid',
        borderWidth: 2,
        padding: 10,
        color: 'white',
    },

    titleText: {
        color: 'white',
        fontWeight: "300",
        fontSize: 38,
        paddingTop: 50,
        flex: 2
    },

    text: {
        color: 'silver',
        fontWeight: '200',
        fontSize: 22,
        paddingTop: 15
    },

    buttons: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 70
    },

    backButton: {
        alignSelf: 'flex-start',
        paddingTop: 25,
        paddingLeft: 10
    }
});
