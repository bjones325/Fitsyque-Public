import React from 'react';
import { ImageBackground, Platform, TouchableOpacity, Dimensions, Text, View, Button, TextInput, StyleSheet } from 'react-native';
import { StackNavigator } from 'react-navigation';
import DropdownAlert from 'react-native-dropdownalert';
import Icon from 'react-native-vector-icons/EvilIcons';
var Spinner = require('react-native-spinkit');
const WINDOW = Dimensions.get('window')

export default class LoginScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            confirmPassword: "",
            email: "",
            visibleAnimation: false
        };
    }

    register = () => {
        if (this.state.password != this.state.confirmPassword) {
            this.dropdown.alertWithType('warn', "Warning", "Password and Confirm Password are not the same.");
            return;
        }
        this.setState({ visibleAnimation: true });
        fetch('https://fitsyque.azurewebsites.net/Register', {
            method: "post",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                login: this.state.username,
                password: this.state.password,
                email: this.state.email
            })
        })
            .then((response) =>
                response.json())
            .then((responseJson) => {
                this.setState({ visibleAnimation: false });
                if (responseJson.success) {
                    this.props.navigation.pop();
                    this.dropdown.alertWithType('success', "Account Created!", "You have successfully registered your account!");
                } else {
                    this.dropdown.alertWithType('error', "Error", responseJson.reason);
                }
            })
            .catch((error) => {
                console.log(error);
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
                <View style={styles.background}>
                    <View style={{flex: 1}}>
                    <TouchableOpacity style = {styles.backButton} onPress={() => this.props.navigation.goBack()}>
                        <Icon name='arrow-left' style={{ fontSize: 36, color: 'silver' }} />
                    </TouchableOpacity>
                        <Text style={styles.titleText}>
                            Register a new account to get started
                        </Text>
                    </View>
                    <View style={styles.buttons}>
                        <View style={{flex: 5, alignItems: 'center'}}>
                            <Text style={styles.text}>
                                Username
                            </Text>
                            <TextInput onChangeText={(text) => this.setState({username: text})}
                                style = {styles.textBox}/>
                            <Text style={styles.text}>
                                Email
                            </Text>
                            <TextInput onChangeText={(text) => this.setState({email: text})} 
                                style = {styles.textBox}/>
                            <Text style={styles.text}>
                                Password
                            </Text>
                            <TextInput onChangeText={(text) => this.setState({password: text})} 
                                style = {styles.textBox}/>
                            <Text style={styles.text}>
                                Confirm Password
                            </Text>
                            <TextInput onChangeText={(text) => this.setState({confirmPassword: text})} 
                                style = {styles.textBox}/> 
                            <Button title="Register" onPress={() => this.register()} />
                            <View>
                                <Spinner isVisible={this.state.visibleAnimation} size={40} type={"ThreeBounce"} color={"#FF0000"}/>
                            </View>
                        </View>
                    </View>
                </View>
                <DropdownAlert defaultContainer={{ padding: 8, paddingTop: Platform.OS === 'android' ? 0 : 10, flexDirection: 'row' }}
                    ref={ref => this.dropdown = ref} startDelta={WINDOW.height + 200} endDelta={WINDOW.height} />
            </ImageBackground>
        );
    }
};

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
        flex: 2,
        paddingHorizontal: 10
    },

    text: {
        color: 'silver',
        fontWeight: '200',
        fontSize: 22,
        paddingTop: 15
    },

    buttons: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 40
    },

    backButton: {
        alignSelf: 'flex-start',
        paddingTop: 25,
        paddingLeft: 10
    }
});