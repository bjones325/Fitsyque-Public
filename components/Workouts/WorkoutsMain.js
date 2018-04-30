import React from 'react';
import { Text, Platform, Dimensions, StyleSheet, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import DaySchedule from './DaySchedule';
import WorkoutModal from "./WorkoutModal";
import TopBar from "../TopBar";
import Modal from "react-native-modal";
import DropdownAlert from 'react-native-dropdownalert';
const WINDOW = Dimensions.get('window')


export default class WorkoutsMain extends React.Component {
    constructor(props) {
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
                        this.setState({ isVisible: true });
                        this.modal.open([0, 1, 1, 0, 0, 1, 1, 1, 0, 0], 0)
                    }}
                />
                <DaySchedule
                    onRef={ref => (this.child = ref)}
                    date={() => this.topBar.getDate()}
                    openModal={(data) => {
                        this.setState({ isVisible: true });
                        this.modal.open(data, 1)
                    }}
                />
                <View style={{flex:1, position: 'absolute', alignSelf: 'center', flexDirection: 'column', justifyContent: 'center'}}>
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
                </View>
                <DropdownAlert defaultContainer={{ flex: 2, padding: 8, paddingTop: Platform.OS === 'android' ? 0 : 10, flexDirection: 'row' }}
                    ref={ref => this.dropdown = ref} startDelta={WINDOW.height + 200} endDelta={WINDOW.height} />
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
        backgroundColor: 'rgba(0,0,0,0.7)'
    },

    modalContainer: {
        backgroundColor: "white",
        padding: 22,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)"
      },
});