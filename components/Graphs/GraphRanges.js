import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Button } from 'react-native';

export default class GraphRanges extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRange: 0
        }
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    getDateDif = () => {
        switch(this.state.selectedRange) {
            case 0:
                return [0,0,0]
            case 1:
                return [7,0,0]
            case 2:
                return [0,1,0]
            case 3:
                return [0,6,0]
            case 4:
                return [0,0,1]
        }
    }

    render() {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <TouchableOpacity onPress={() => {
                    this.setState({
                        selectedRange: 0
                    })
                    this.props.update(0, 0, 0);
                }}>
                    <Text style={this.state.selectedRange == 0 ? styles.selected : styles.regular}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    this.setState({
                        selectedRange: 1
                    })
                    this.props.update(7, 0, 0);
                }}>
                    <Text style={this.state.selectedRange == 1 ? styles.selected : styles.regular}>Week</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    this.setState({
                        selectedRange: 2
                    })
                    this.props.update(0, 1, 0);
                }}>
                    <Text style={this.state.selectedRange == 2 ? styles.selected : styles.regular}>Month</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    this.setState({
                        selectedRange: 3
                    })
                    this.props.update(0, 6, 0);
                }}>
                    <Text style={this.state.selectedRange == 3 ? styles.selected : styles.regular}>6 Months</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    this.setState({
                        selectedRange: 4
                    })
                    this.props.update(0, 0, 1);
                }}>
                    <Text style={this.state.selectedRange == 4 ? styles.selected : styles.regular}>Year</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    selected: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: 'green',
        color: 'white',
        textAlign: 'center',
        paddingHorizontal: 3,
        overflow: "hidden"
    },

    regular: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: 'lightblue',
        color: 'black',
        textAlign: 'center',
        paddingHorizontal: 3,
        overflow: "hidden"
    }
})