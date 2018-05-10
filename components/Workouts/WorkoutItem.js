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
                    disableRightSwipe={true}
                    disableLeftSwipe={false}
                    rightOpenValue={-75}
                    recalculateHiddenLayout={true}
                >
                <TouchableOpacity
                    style={styles.standaloneRowBack}
                    onPress={() => this.props.onDelete()}
                    >
                    <Text style={{ fontWeight: 'bold' }}>Delete</Text>
                
                </TouchableOpacity>
                    <View style={styles.standaloneRowFront}>
                        {this.props.item[0] == 0 ?
                            <Text style={styles.itemText}>{'\u2022'} Sets: {this.props.item[1]}, Reps: {this.props.item[2]}, Weight: {this.props.item[3]} </Text>
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

    standaloneRowBack: {
        alignItems: 'center',
        backgroundColor: 'red',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 15,
        flex: 1
    }
});