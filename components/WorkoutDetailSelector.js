import React from 'react';
import { Text, View, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';

export default class LoginScreen extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.fullView}>
                <Text style={styles.text}>{this.props.text}</Text>
                <View style={styles.barView}>
                    <TouchableOpacity onPress={() => {
                        var workouts = this.props.getValue - 15 < 0 ? 0 : this.props.getValue - 15;
                        this.props.updateValue(workouts)
                    }}>
                        <Icon name="minus" style={{ fontSize: 40 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        var workouts = this.props.getValue - 5 < 0 ? 0 : this.props.getValue - 5;
                        this.props.updateValue(workouts)
                    }}>
                        <Icon name="minus" style={{ fontSize: 32 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        var workouts = this.props.getValue - 1 < 0 ? 0 : this.props.getValue - 1;
                        this.props.updateValue(workouts)
                    }}>
                        <Icon name="minus" style={{ fontSize: 24 }} />
                    </TouchableOpacity>
                    <Text style={styles.valueStyle}> {this.props.getValue} </Text>
                    <TouchableOpacity onPress={() => {
                        var workouts = this.props.getValue + 1;
                        this.props.updateValue(workouts)
                    }}>
                        <Icon name="plus" style={{ fontSize: 24 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        var workouts = this.props.getValue + 5;
                        this.props.updateValue(workouts)
                    }}>
                        <Icon name="plus" style={{ fontSize: 32 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        var workouts = this.props.getValue + 15;
                        this.props.updateValue(workouts)
                    }}>
                        <Icon name="plus" style={{ fontSize: 40 }} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    barView: {
        //flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 5
    },

    fullView: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 30
    },

    text: {
        fontWeight: '200',
        fontSize: 22,
    },

    valueStyle: {
        fontWeight: '300',
        fontSize: 24,
    }
});