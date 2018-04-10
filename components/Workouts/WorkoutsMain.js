import React from 'react';
import {Platform, Dimensions, StyleSheet, View} from 'react-native';
import { NavigationActions } from 'react-navigation';
import DaySchedule from './DaySchedule';
import WorkoutModal from "./WorkoutModal";
import TopBar from "../TopBar";
import DropdownAlert from 'react-native-dropdownalert';
const WINDOW = Dimensions.get('window')


export default class WorkoutsMain extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isVisible: false,
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <TopBar
                    nav={this.props.navigation}
                    onRef={ref => (this.topBar = ref)}
                    getData={(date) => this.child.requestWorkoutData(date)}
                    plusPress={() => {
                        this.setState({isVisible: true});
                        this.modal.open([0,0,0,0,0,0,0,0,0,0], 0)
                    }}
                />
                <DaySchedule
                    onRef={ref => (this.child = ref)}
                    date={new Date()} 
                    openModal={(data) => {
                        this.setState({isVisible: true});
                        this.modal.open(data, 1)
                    }}
                />
                <WorkoutModal
                    onRef={ref => (this.modal = ref)}
                    date={() => this.topBar.getDate()}
                    isVisible={this.state.isVisible}
                    onClose={(update, type, header, text) => {
                        this.setState({
                            isVisible: false,
                            index: 0
                        })
                        if (update) {
                            this.child.requestWorkoutData(this.topBar.getDate());
                            this.dropdown.alertWithType(type, header, text);
                        }
                    }}
                />
                <DropdownAlert     defaultContainer={{ padding: 8, paddingTop: Platform.OS === 'android' ? 0 : 10, flexDirection: 'row' }}
                ref={ref => this.dropdown = ref} startDelta={WINDOW.height + 200} endDelta={WINDOW.height}/>
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
});