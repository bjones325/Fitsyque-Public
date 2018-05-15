import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationActions } from 'react-navigation';

export default class About extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.headerText}>About Us</Text>
                <Text style={styles.mainText}>
                    My name is Blake Jones and I am the sole developer for Fitsyque.
                    I'm currently enrolled at the Georgia Institute of Technology as a Computer Science major
                    with concentrations in artificial intelligence and data networking.
                    {"\n\n"}
                    I began seriously exercising in my Sophomore year of college, when I noticed there was a lack of a well-designed,
                    well-maintained, free app to track workouts. All of the apps on the market were buggy,
                    underdeveloped/difficult to use, required an expensive subscription, or all of the above.
                    With this, I decided to begin developing Fitsyque with the goal of making the app truly focused on the user.
                </Text>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerText: {
        color: 'silver',
        fontSize: 24
    },
    mainText: {
        color: 'silver',
        fontSize: 16,
        paddingHorizontal: 30
    }
})