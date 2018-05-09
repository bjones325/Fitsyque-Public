import React from 'react';
import { Text, View, Button, TextInput, StyleSheet, SectionList, AsyncStorage, ListItem, Header, TouchableOpacity } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/Entypo';
import WorkoutItem from './WorkoutItem';
import Network from "../Network";
var Spinner = require('react-native-spinkit');


export default class DaySchedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: [{ data: ['null'], title: "null" }]
        };
        this.requestWorkoutData(new Date());
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    requestWorkoutData = (date) => {
        this.setState({ loading: true });
        Network.authCall("https://fitsyque.azurewebsites.net/DayList", "get",
            {
                date: date.toISOString().substring(0, 10)
            },
            null,
            (responseJson) => {
                this.parseData(responseJson.data);
            },
            (responseJson) => {
                this.props.navigation.dispatch(resetB);
                alert(responseJson.message);
            },
            () => {
                alert("There was an internal error while connecting! Please restart the app.");
            },
            () => {
                this.setState({ loading: false });
            });
    }

    deleteEntry = (id) => {
        Network.authCall("https://fitsyque.azurewebsites.net/DayList", "delete",
        {
            date: this.props.date()
        },
        JSON.stringify({
            RecordID: id
        }),
        (responseJson) => {
            this.requestWorkoutData(this.props.date());
        },
        (responseJson) => {
            alert("Failed to delete?");
        },
        () => {
            alert("There was an internal error while connecting! Please restart the app.");
        },
        () => {
            this.setState({ loading: false });
        });
    }

    render() {
        return (
            <View style={styles.view}>
                {this.state.loading ?
                    <Spinner style={{alignSelf: 'center'}} isVisible={this.state.loading} size={40} type={"ThreeBounce"} color={"#FF0000"} />
                    :
                    this.state.data.length == 0 ?
                        <Text style={{textAlign: 'center'}}> No Workouts Logged </Text>
                        :
                        <SectionList
                        stickySectionHeadersEnabled={false}
                        style={styles.flatlist}
                        keyExtractor={(item, index) => item + index}
                        renderItem={({item}) => 
                            <WorkoutItem item={item} onDelete={() => this.deleteEntry(item[9])}/>
                        }
                        renderSectionHeader={({ section }) =>
                        <View style={styles.header}>
                            <Text style={styles.headerText}> {section.title} </Text>
                            <View style={styles.endHeader}>
                                <TouchableOpacity style={styles.iconTouch} onPress={() => {
                                    var length = this.state.sections[section.title].length - 1
                                    this.props.openModal(this.state.sections[section.title][length]);
                                }}>
                                    <Text style={{color: 'lawngreen', fontSize: 12, textAlign: 'center', paddingTop: 2}}>Quick Add</Text>
                                    <Icon name="add-to-list" style={styles.plus} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        }
                        sections={this.state.data}
                    />
                }
            </View>
        );
    }

    parseData = (jsonData) => {
        var sections = {};
        for (var i = 0; i < jsonData.length; i++) {
            var item = sections[jsonData[i].Name];
            if (item == null) {
                sections[jsonData[i].Name] = [];
            }
            sections[jsonData[i].Name].push([
                jsonData[i].TypeID,
                jsonData[i].Sets,
                jsonData[i].Reps,
                jsonData[i].Weight,
                jsonData[i].Duration,
                jsonData[i].Intensity,
                jsonData[i].Incline,
                jsonData[i].Resistence,
                jsonData[i].ExerciseID,
                jsonData[i].RecordID,
                jsonData[i].Name
            ])
        }
        var result = Object.keys(sections).map(function (key) {
            return { title: key, data: sections[key] };
        });
        this.setState({
            data: result,
            loading: false,
            sections: sections
        });
    }
};

const resetB = NavigationActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'MainScreen' })],
});

const styles = StyleSheet.create({
    view: {
        flex: 1,
        marginHorizontal: 5,
        borderRadius: 25,
        borderColor: 'silver',
        borderStyle: 'solid',
        borderWidth: 1,
        maxHeight: 530,
        justifyContent: 'center',
        zIndex: 21,
        overflow: 'hidden'
    },

    flatlist: {
        flex: 1,
        zIndex: 20
    },

    item: {
        color: 'darkgray', //#841584
        fontSize: 16,
        paddingLeft: 10
    },

    headerText: {
        color: 'silver', //#841584
        fontWeight: 'bold',
        fontSize: 22,
        padding: 4,
        flex: 3
    },

    header: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    endHeader: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
    },

    iconTouch: {
        justifyContent: 'flex-end',
        paddingRight: 15
    },

    plus: {
        fontSize: 32,
        color: 'lawngreen',
        alignSelf: 'center'
    },
});