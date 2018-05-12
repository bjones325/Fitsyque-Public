import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { SwipeRow } from 'react-native-swipe-list-view';
import Collapsible from 'react-native-collapsible';

export default class WorkoutItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Collapsible collapsed={this.props.collapsed}>
                <SwipeRow
                    disableRightSwipe={false}
                    disableLeftSwipe={false}
                    leftOpenValue={75}
                    stopLeftSwipe={75}
                    rightOpenValue={-75}
                    stopRightSwipe={-75}
                    recalculateHiddenLayout={true}
                >
                <View style={styles.backRow}>
                    <TouchableOpacity
                        style={styles.backUpdate}
                        onPress={() => this.props.onUpdate()}
                        >
                        <Text style={{ fontWeight: 'bold' }}>Update</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.backDelete}
                        onPress={() => this.props.onDelete()}
                        >
                        <Text style={{ fontWeight: 'bold' }}>Delete</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.standaloneRowFront}>
                        {this.props.item[0] == 0 ?
                            <Text style={styles.itemText}>{'\u2022'} {this.props.item[2]} x {this.props.item[3]}lb, {this.props.item[1]} sets </Text>
                            :
                            <Text style={styles.item}>{'\u2022'} Sets: {this.props.item[1]}, Reps: {this.props.item[2]}, Duration: {this.props.item[4]}, Intensity: {this.props.item[5]}, Incline: {this.props.item[6]}, Resistence: {this.props.item[7]} </Text>
                        }
                </View>
                </SwipeRow>
            </Collapsible>
        );
    }
}

const styles = StyleSheet.create({
    itemText: {
        color: 'black', //#841584
        fontSize: 16,
        paddingLeft: 10
    },

    standaloneRowFront: {
        height: 50,
        justifyContent: 'center',
        backgroundColor: 'darkgray',
    },

    backRow: {
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        flexDirection: 'row',
        flex: 1
    },

    backUpdate: {   
        alignItems: 'center',
        backgroundColor: 'green',
        height: 50,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        paddingHorizontal: 15,
        flex: 1
    },

    backDelete: {
        alignItems: 'center',
        backgroundColor: 'red',
        height: 50,
        justifyContent: 'flex-end',
        flexDirection: 'row',
        paddingHorizontal: 15,
        flex: 1
    }
});