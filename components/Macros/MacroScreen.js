import React from 'react';
import {Text, Platform, Dimensions, StyleSheet, TouchableOpacity, View, processColor} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/EvilIcons';
import TopBar from '../TopBar';
import Modal from "react-native-modal";
import PieGraph from './PieGraph'
import MacroInformation from './MacroInformation';
import DropdownAlert from 'react-native-dropdownalert';
import NetworkCall from '../Network';
const WINDOW = Dimensions.get('window')


export default class MacroScreen extends React.PureComponent {
    constructor(props){
        super(props);
        this.state = {
            data: [],
            Fat: 0,
            Protein: 0,
            Carb: 0,
            loading: false,
            unparsedData: []
        };
        this.requestMacroData(new Date());
        this.parseData([{Fat: 1, Protein: 2, Carb: 3}])
    }

    requestMacroData = (date) => {
        this.setState({loading: true});
        var call = new NetworkCall();
        call.url = "https://fitsyque.azurewebsites.net/Macro"
        call.type = "get"
        call.extraHeaders = {
            date: date.toISOString().substring(0, 10)
        }
        call.onSuccess = (responseJson) => {
            this.parseData(responseJson.data);
            this.setState({loading: false});
        }
        call.onFailure = (responseJson) => {
            this.props.navigation.dispatch(resetB);
            alert(responseJson.message);
        }
        call.onError = () => {
            this.dropdown.alertWithType("error", "Internal Error", "There was an internal error while connecting! Please restart the app.");
        }
        call.execute(true);
    }

    deleteMacro = (id) => {
        var call = new NetworkCall();
        call.url = "https://fitsyque.azurewebsites.net/Macro/Delete"
        call.type = "post"
        call.body = JSON.stringify({
            RecordID: id
        })
        call.onSuccess = (responseJson) => {
            this.requestMacroData(this.topBar.getDate())
        }
        call.onFailure = (responseJson) => {
            alert(responseJson.message);
        }
        call.onError = (responseJson) => {
            console.log(error);
            console.log(responseJson);
            this.props.onClose("error", "Internal Error", "There was an internal error while connecting! Please restart the app.")
        }
        call.execute(true);
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
            unparsedData: jsonData,
            data: {
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
        });
        return {
            
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