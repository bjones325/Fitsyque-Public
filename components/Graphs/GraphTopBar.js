import React from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput, Text, Button } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';

export default class GraphTopBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
        };
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    getDate = () => {
        return this.state.date;
    }

    render() {
        return (
            <View style={styles.barView}>
                <View style={styles.invisible}>
                    <TouchableOpacity onPress={() => this.props.nav.goBack()}>
                        <Icon name='arrow-left' style={{ fontSize: 36, color: 'silver' }} />
                    </TouchableOpacity >
                </View>
                <View style={styles.centerBar}>
                    <TouchableOpacity onPress={() => {
                        var date = this.state.date;
                        date.setDate(date.getDate() - 1);
                        this.setState({ date: date });
                        this.props.getData(-1);
                    }}>
                        <Icon name="chevron-left" style={{ fontSize: 36 }} />
                    </TouchableOpacity >
                    <Text style={styles.text}>
                        {this.state.date.toISOString().substring(0, 10)}
                    </Text>
                    <TouchableOpacity onPress={() => {
                        var date = this.state.date;
                        date.setDate(date.getDate() + 1);
                        this.setState({ date: date });
                        this.props.getData(1);
                    }}>
                        <Icon name="chevron-right" style={{ fontSize: 36 }} />
                    </TouchableOpacity>
                </View>
                <View style={styles.endBar}>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    text: {
        color: 'red', //#841584
        fontWeight: "300",
        fontSize: 24,
    },

    invisible: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
    },

    centerBar: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },

    barView: {
        maxHeight: 50,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        marginHorizontal: 5
    },

    endBar: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
    },

    icon: {
        justifyContent: 'flex-end',
        //alignSelf: 'flex-end',
    },
});