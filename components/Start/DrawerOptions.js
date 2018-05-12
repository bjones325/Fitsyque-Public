import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NavigationActions } from 'react-navigation';

export default class DrawerOptions extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <Text style={styles.controlText}>My Account</Text>
                <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate("About")}>
                    <Text>About Us</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate("Contact")}>
                    <Text>Contact Us</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.dispatch(resetMain)}>
                    <Text>Log out</Text>
                </TouchableOpacity>
            </ScrollView>
        )
    }
}

var resetMain = NavigationActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({routeName: 'Start'})],
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'black',
    },
    controlText: {
        color: 'white',
        alignSelf: 'center'
    },
    button: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        alignItems: 'center'
    }
})