import React from 'react';
import {Text, Platform, Dimensions, StyleSheet, TouchableOpacity, View, AsyncStorage, processColor} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/EvilIcons';
const WINDOW = Dimensions.get('window')


export default class MacroScreen extends React.PureComponent {
    constructor(props){
        super(props);

    }

    generatePercent = (type) => {
        var total = parseInt(this.props.amount.Fat) + parseInt(this.props.amount.Protein) + parseInt(this.props.amount.Carb);
        switch(type) {
            case 1:
                return (this.props.amount.Fat / total) * 100
            case 2:
                return (this.props.amount.Protein / total) * 100
            case 3:
                return (this.props.amount.Carb / total) * 100
        }
        return 0
    }

    render() {
        switch(this.props.type){
            case 1:
                return (
                    <View style={styles.container}>
                        <Text style={styles.text}>You have consumed {this.props.amount.Fat} grams of Fat for {this.generatePercent(1)}% of your macro intake.</Text>
                        <Text style={styles.description}>
                            Fat is important for many metabolic functions such as disolving vitamins and maintaining healthy hair and skin.
                            Unsaturated fats can support good cholesterol levels and proper heart function.
                            Saturated fats however can clog arteries and raise bad cholesterol.
                            We can increase our intake of unsaturated fats by eating foods such as nuts, seeds, and fish, rather than cookies, cakes, and fried foods.</Text>
                    </View>
                );
            case 2:
                return (
                    <View style={styles.container}>
                        <Text style={styles.text}>You have consumed {this.props.amount.Protein} grams of Protein for {this.generatePercent(2)}% of your macro intake.</Text>
                        <Text style={styles.description}>
                            Protein acts as the backbone for developing muscle.
                            While it is beneficial to maximimize protein intake as much as possible for any fitness goal,
                            large amounts of protein can greatly increase calorie intake. It is important to balance a good
                            intake of protein with proper calorie counting.
                        </Text>
                    </View>
                );
            case 3:
                return (
                    <View style={styles.container}>
                        <Text style={styles.text}>You have consumed {this.props.amount.Carb} grams of Carb for {this.generatePercent(3)}% of your macro intake.</Text>
                        <Text style={styles.description}>
                            Carbohydrates are the main source of calorie intake, and so are very important to
                            maintaining a healthy energy intake. By unnecessarily reducing carb intake,
                            your body becomes restricted in it's ability to generate heat and survive.
                            By maintaing a healthy balance of carbs, it is easy to provide your body with its needed energy
                            while achieving your fitness goals.
                        </Text>
                    </View>
                );
            default:
                return (
                    <View style={styles.container} />
                )
        }

    }
}

const styles = StyleSheet.create({

    text: {
        color: 'red', //#841584
        fontSize: 22,
    },

    description: {
        color: 'gray', //#841584
        fontSize: 16,
    },
    
    container: {
        flex: 1,
        padding: 10
    },
});