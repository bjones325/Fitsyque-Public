import React from 'react';
import { Text, Platform, Dimensions, StyleSheet, TouchableOpacity, View, AsyncStorage, processColor, FlatList } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { SwipeRow } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/EvilIcons';
const WINDOW = Dimensions.get('window')


export default class MacroInformation extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <FlatList
                data={this.props.data}
                extraData={this.state}
                style={{ flex: 1, borderColor: 'silver', borderWidth: 1, overflow: 'hidden', borderRadius: 5, margin: 5 }}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) => {
                    return (
                        <SwipeRow
                            leftOpenValue={75}
                            stopLeftSwipe={75}
                            rightOpenValue={-75}
                            stopRightSwipe={-75}
                            recalculateHiddenLayout={true}
                        >
                            <View style={styles.backRow}>
                                <TouchableOpacity
                                    style={styles.backUpdate}
                                    onPress={() => this.props.navigation.navigate("AddMacro", {
                                        update: 1,
                                        recordID: item.RecordID,
                                        fat: item.Fat,
                                        protein: item.Protein,
                                        carb: item.Carb,

                                    })}
                                >
                                    <Text style={{ fontWeight: 'bold' }}>Update</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.backDelete}
                                    onPress={() => this.props.deleteMacro(item.RecordID)}
                                >
                                    <Text style={{ fontWeight: 'bold' }}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.standaloneRowFront}>
                                <Text style={styles.itemText}>Fat: {item.Fat}--Protein: {item.Protein}--Carbs: {item.Carb}</Text>
                            </View>
                        </SwipeRow>
                    )
                }}
            />
        )

    }
}

const styles = StyleSheet.create({

    itemText: {
        color: 'black', //#841584
        fontSize: 16,
        paddingLeft: 10,
        textAlign: 'center'
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