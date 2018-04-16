import React from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput, Text, Button } from 'react-native';

export default class GraphRanges extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            begin: new Date(),
            end: new Date(),
            selectedRange: 0
        }
    }

    render() {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => {
                    this.setState({
                        selectedRange: 0
                    })
                    this.props.update(this.props.date());
                }}>
                    <Text style={this.state.selectedRange == 0 ? styles.selected : styles.regular}> Today </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    var date = new Date();
                    date.setDate(this.props.date().getDate() - 7)
                    this.setState({
                        selectedRange: 1
                    })
                    this.props.update(date);
                }}>
                    <Text style={this.state.selectedRange == 1 ? styles.selected : styles.regular}> Week </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    var date = new Date();
                    date.setMonth(this.props.date().getMonth() - 1)
                    this.setState({
                        selectedRange: 2
                    })
                    this.props.update(date);
                }}>
                    <Text style={this.state.selectedRange == 2 ? styles.selected : styles.regular}> Month </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    var date = new Date();
                    date.setMonth(this.props.date().getMonth() - 6)
                    this.setState({
                        selectedRange: 3
                    })
                    this.props.update(date);
                }}>
                    <Text style={this.state.selectedRange == 3 ? styles.selected : styles.regular}> 6 Months </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    var date = new Date();
                    date.setYear(this.props.date().getYear() - 1)
                    this.setState({
                        selectedRange: 4
                    })
                    this.props.update(date);
                }}>
                    <Text style={this.state.selectedRange == 4 ? styles.selected : styles.regular}> Year </Text>
                </TouchableOpacity>
            </View>
        );
    }
}




const styles = StyleSheet.create({
    selected: {
        color: 'green'
    },

    regular: {
        color: 'black'
    }
})