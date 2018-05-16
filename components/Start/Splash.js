import React from 'react';
import {Text, View, Button, StyleSheet, ImageBackground} from 'react-native';

export default class Splash extends React.Component{
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
                source={require("../../Assets/bentover.jpg")}
                >
                <View style={Styles.background}>
                        <Text style={Styles.titleText}>
                            Fitsyque
                        </Text>
                        <Text style = {Styles.subText}>
                            Where Fitness Meets Technology
                        </Text>
                    <View style={Styles.buttons}>
                        <Button title="Login" onPress={() => this.props.navigation.navigate('Login')}/>
                        <Button title="Register" onPress={() => this.props.navigation.navigate('Register')}/>
                    </View>
                </View>
            </ImageBackground>
        );
    }
}

const Styles = StyleSheet.create({
    background: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },

    titleText: {
        color: 'indianred',
        fontWeight: "400",
        fontSize: 38,
        paddingTop: 50,
    },

    subText: {
        color: 'lightgray',
        fontSize: 22,
        fontWeight: "100",
    },
    
    buttons: {
        flex: 2,
        justifyContent: 'flex-end',
        flexDirection: 'column',
        paddingBottom: 50
    },
})
