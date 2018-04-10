import React from 'react';
import {Text, Platform, Dimensions, StyleSheet, TouchableOpacity, View, AsyncStorage} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/EvilIcons';
import TopBar from '../TopBar';
import Modal from "react-native-modal";
import MacroModal from './MacroModal';
import PieGraph from './PieGraph'
import DropdownAlert from 'react-native-dropdownalert';
const WINDOW = Dimensions.get('window')


export default class MacroScreen extends React.PureComponent {
    constructor(props){
        super(props);
        this.state = {
            data: [],
            isVisible: false,
            Fat: 0,
            Protein: 0,
            Carb: 0,
            loading: false,
        };
        this.requestMacroData(new Date());
    }

    requestMacroData = (date) => {
        this.setState({loading: true});
        AsyncStorage.getItem('@app:session').then((token) => {
            return fetch('https://fitsyque.azurewebsites.net/Macro', {
                method: "get",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token,
                    date: date.toISOString().substring(0, 10)
                }
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if(!responseJson.success) {
                this.props.navigation.dispatch(resetB);
                alert(responseJson.message);
            } else {
                this.setState({data: this.parseData(responseJson.data)});
                this.setState({loading: false});
            }
        })
        .catch((error) => {
            console.log(error);
            this.setState({isVisible: false});
            this.dropdown.alertWithType("error", "Internal Error", "There was an internal error while connecting! Please restart the app.");
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <TopBar nav={this.props.navigation} onRef={ref => (this.topBar = ref)} getData={(date) => this.requestMacroData(date)}
                    plusPress={() => this.setState({isVisible: true, selectedWorkout: {}, searchInput: ""})} />
                <View>
                    {(this.state.Fat + this.state.Protein + this.state.Carb) == 0 ?
                    <Text> No Data </Text>
                    :
                    <View>
                        <PieGraph data={this.state.data}/>
                        <Text style={{color: '#ff4500'}}> {'\u25A3'} Fat: {this.state.Fat} </Text>
                        <Text style={{color: '#000080'}}> {'\u25A3'} Protein: {this.state.Protein} </Text>
                        <Text style={{color: '#ffa500'}}> {'\u25A3'} Carbs: {this.state.Carb} </Text>
                    </View>
                    }
                </View>
                <Modal
                    style = {styles.modal}
                    isVisible={this.state.isVisible}
                    backdropColor = 'gray'
                    backdropOpacity = {0.5}
                    onBackdropPress = {() => {
                        this.setState({isVisible: false})
                    }}
                    animationIn = "fadeIn"
                    animationOut = "fadeOut"
                    >
                    <MacroModal 
                        date={() => this.topBar.getDate()}
                        onClose={(type, header, text) => {
                            this.setState({isVisible: false})
                            this.requestMacroData(this.topBar.getDate());
                            this.dropdown.alertWithType(type, header, text);
                    }}/>
                </Modal>
                <DropdownAlert
                        defaultContainer={{ padding: 8, paddingTop: Platform.OS === 'android' ? 0 : 10, flexDirection: 'row' }}
                        ref={ref => this.dropdown = ref} startDelta={WINDOW.height + 200} endDelta={WINDOW.height}/>
            </View>
        );
    }

    parseData = (jsonData) => {
        var fat = parseInt(jsonData.Fat);
        var protein = parseInt(jsonData.Protein);
        var carb = parseInt(jsonData.Carb);
        var total = fat + protein + carb;
        total = (total == 0 ? 1 : total);
        console.log(total);
        this.setState({Fat: jsonData.Fat == undefined ? 0 : jsonData.Fat,
            Protein: jsonData.Protein == undefined ? 0 : jsonData.Protein,
            Carb: jsonData.Carb == undefined ? 0 : jsonData.Carb});
        return [{
            amount: fat,
            percent: Math.round(fat / total * 100),
            svg: {
                fill: '#ff4500',
            },
            key: 'pie-$1',
            label: 'Fat'
        },
        {
            amount: protein,
            percent: Math.round(protein / total * 100),
            svg: {
                fill: '#000080',
            },
            key: 'pie-$2',
            label: 'Protein'
        },
        {
            amount: carb,
            percent: Math.round(carb / total * 100),
            svg: {
                fill: '#ffa500',
            },
            key: 'pie-$3',
            label: 'Carb'
        }]
    }

};

const resetB = NavigationActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName: 'MainScreen'})],
});

const styles = StyleSheet.create({

    text: {
        color: 'red', //#841584
        fontWeight: 'bold',
        fontSize: 18,
        
    },
    
    container: {
        flex: 1,
    },

    pieView: {
        flex: 1,
        justifyContent: 'center'
    },

    modal: {
        justifyContent: 'center',
        alignSelf: 'center',
        flex: 1
    },
});