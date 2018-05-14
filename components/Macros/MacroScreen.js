import React from 'react';
import {Text, Platform, Dimensions, StyleSheet, TouchableOpacity, View, AsyncStorage, processColor} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/EvilIcons';
import TopBar from '../TopBar';
import Modal from "react-native-modal";
import PieGraph from './PieGraph'
import MacroInformation from './MacroInformation';
import DropdownAlert from 'react-native-dropdownalert';
const WINDOW = Dimensions.get('window')


export default class MacroScreen extends React.PureComponent {
    constructor(props){
        super(props);
        this.state = {
            data: this.parseData([{Fat: 1, Protein: 2, Carb: 3}]),
            Fat: 0,
            Protein: 0,
            Carb: 0,
            loading: false,
            unparsedData: []
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

    deleteMacro = (id) => {
        AsyncStorage.getItem('@app:session').then((token) => {
            return fetch('https://fitsyque.azurewebsites.net/Macro/Delete', {
                method: "post",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: JSON.stringify({
                    RecordID: id
                })
            })
        })
            .then((response) =>
                response.json()
            )
            .then((responseJson) => {
                if (!responseJson.success) {
                    alert(responseJson.message);
                } else {
                    this.requestMacroData(this.topBar.getDate())
                }
            })
            .catch((error) => {
                console.log(error);
                console.log(responseJson);
                this.props.onClose("error", "Internal Error", "There was an internal error while connecting! Please restart the app.")
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <TopBar
                    endIcon
                    nav={this.props.navigation}
                    onRef={ref => (this.topBar = ref)}
                    getData={(date) => this.requestMacroData(date)}
                    plusPress={() => {
                        this.props.navigation.navigate("AddMacro", {
                            date: this.topBar.getDate()
                        });
                    }}
                    dotURL={"https://fitsyque.azurewebsites.net/Macro/DotDates"}/>
                <View>
                    {(this.state.Fat + this.state.Protein + this.state.Carb) == 0 ?
                    <Text style={{textAlign: 'center', padding: 20}}> No Macronutrient Data </Text>
                    :
                    <View style={{height: 400, width: WINDOW.width, alignItems: 'center', flexDirection: 'column', justifyContent: 'center'}}>
                        <PieGraph data={this.state.data} onSelect={(type) => { console.log(type);
                            this.setState({selectedType: type})}}/>
                        <Text style={{color: 'darkgray', fontSize: 30}}>Macronutrient Record</Text> 
                        <View style={{flexDirection: 'row', paddingTop: 5}}>
                            <Text style={{color: '#ff4500', fontSize: 20, fontWeight: '500'}}>  Fat: {this.state.Fat} </Text>
                            <Text style={{fontSize: 20}}> {'\u25A3'} </Text>
                            <Text style={{color: '#000080', fontSize: 20, fontWeight: '500'}}> Protein: {this.state.Protein} </Text>
                            <Text style={{fontSize: 20}}> {'\u25A3'} </Text>
                            <Text style={{color: '#ffa500', fontSize: 20, fontWeight: '500'}}> Carbs: {this.state.Carb} </Text>
                        </View>
                    </View>
                    }
                </View>
                <MacroInformation deleteMacro={(id) => this.deleteMacro(id)} navigation={this.props.navigation} data={this.state.unparsedData} />
                <DropdownAlert
                        defaultContainer={{ padding: 8, paddingTop: Platform.OS === 'android' ? 0 : 10, flexDirection: 'row' }}
                        ref={ref => this.dropdown = ref} startDelta={WINDOW.height + 200} endDelta={WINDOW.height}/>
            </View>
        );
    }

    parseData = (jsonData) => {
        var totalFat = 0;
        var totalProtein = 0;
        var totalCarb = 0;
        for (var i = 0; i < jsonData.length; i++) {
            totalFat += jsonData[i].Fat;
            totalProtein += jsonData[i].Protein;
            totalCarb += jsonData[i].Carb;
        }
        this.setState({
            Fat: totalFat,
            Protein: totalProtein,
            Carb: totalCarb,
            unparsedData: jsonData
        });
        return {
            dataSets: [{
                values: [
                    {value: totalFat, id: 1},
                    {value: totalProtein, id: 2},
                    {value: totalCarb, id: 3}
                ],
                label: 'Pie dataset',
                config: {
                    colors: [processColor('#ff4500'), processColor('#000080'), processColor('#ffa500'), processColor('#8CEAFF'), processColor('#FF8C9D')],
                    valueTextSize: 20,
                    valueTextColor: processColor('green'),
                    sliceSpace: 5,
                    selectionShift: 13
                }
            }]
        }
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
        backgroundColor: 'rgba(0,0,0,0.7)'
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