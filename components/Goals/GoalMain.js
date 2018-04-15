import React from 'react';
import { Text, Platform, Dimensions, StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/EvilIcons';
import DropdownAlert from 'react-native-dropdownalert';
const WINDOW = Dimensions.get('window')


export default class GoalsMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            goalTypes: [
                {Name: "Increase Mass"}, 
                {Name: "Strength"}, 
                {Name: "Tone"}, 
                {Name: "Cut"}, 
                {Name: "Increase Endurance"}, 
            ],
            selectedGoal: ""
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style = {styles.backButton} onPress={() => this.props.navigation.goBack()}>
                        <Icon name='arrow-left' style={{ fontSize: 36}} />
                </TouchableOpacity >
                <View style={styles.goalList}>
                    <Text style={styles.text}> Select your Goal </Text>
                    <FlatList
                        data={this.state.goalTypes}
                        style={{
                            paddingHorizontal: 8,
                            flex: 1,
                            borderRadius: 25,
                            height: 150,
                            borderWidth: 1,
                        }}
                        keyExtractor={(item, index) => item.Name}
                        renderItem={({item}) => {  
                                return <TouchableOpacity onPress={() => {
                                    this.setState({
                                        selectedGoal: item.Name
                                        })
                                    }}>
                                <Text style={this.state.selectedGoal == item.Name ? styles.selectedItem : styles.item}>{item.Name}</Text></TouchableOpacity>}
                        }
                    />
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    text: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 18,
    },

    container: {
        flex: 1,
    },

    modalContainer: {
        backgroundColor: "white",
        padding: 22,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)"
    },

    item: {
        paddingVertical: 5,
        fontSize: 16,
        height: 26,
    },

    selectedItem: {
        paddingVertical: 5,
        fontSize: 16,
        height: 26,
        color: 'green'
    },

    backButton: {
        alignSelf: 'flex-start',
        paddingTop: 25,
        paddingLeft: 10
    },

    goalList: {
        justifyContent: "center",
        alignItems: "center",
        height: 160
    }
});