import React from 'react';
import {Text, TextField, View, Button, TextInput, StyleSheet, FlatList, TouchableOpacity, AsyncStorage} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Modal from "react-native-modal";
import WorkoutListModal from './WorkoutListModal';
import CardioModal from './CardioModal';
import StrengthModal from './StrengthModal';

// INTEGRATION AND API TEST --- SUPERTEST --- REALWORLD EXAMPLE APP

export default class WorkoutModal extends React.PureComponent {
    constructor(props){
        super(props);
        this.state = {
            selectedWorkout: {},
            index: 0,
            initial: {
                Sets: 0,
                Reps: 0,
                Weight: 0,
                Duration: 0,
                Intensity: 0,
                Incline: 0,
                Resistence: 0
            }
        };
    }

    componentDidMount() {
        this.props.onRef(this)
    }
      
    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    open = (workout, i) => {
        this.setState({
            selectedWorkout: {
                TypeID: workout[0],
                ExerciseID: workout[8]
            },
            initial: {
                Sets: workout[1],
                Reps: workout[2],
                Weight: workout[3],
                Duration: workout[4],
                Intensity: workout[5],
                Incline: workout[6],
                Resistence: workout[7]
            },
            index: i
        })
    }

    render() {
        return(
            <Modal
                isVisible={this.props.isVisible}
                backdropColor = 'gray'
                backdropOpacity = {0.8}
                onBackdropPress = {() => {
                    this.props.onClose(false, "","","")
                }}
                animationIn = "fadeIn"
                animationOut = "fadeOut"
            >
            <View style={styles.modalContainer}>
            {this.state.index == 0 ?
                <WorkoutListModal
                    next={(workout) => {
                        this.setState({
                            selectedWorkout: workout,
                            index: 1
                        });
                    }}
                /> :
                this.state.selectedWorkout.TypeID == 0 ?
                    <StrengthModal
                        date={() => this.props.date()}
                        selectedWorkout={this.state.selectedWorkout}
                        initial={this.state.initial}
                        onClose={(a,b,c) => {this.props.onClose(true, a,b,c)}}
                    /> :
                    <CardioModal
                        date={() => this.props.date()}
                        selectedWorkout={this.state.selectedWorkout}
                        initial={this.state.initial}
                        onClose={(a,b,c) => {this.props.onClose(true, a,b,c)}}
                    />
            }
            </View>
            </Modal>
        );
    }
};

const styles = StyleSheet.create({

    confirmButton: {
        color: 'green',
        borderRadius: 25,
    },

    barView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },

    item: {
        padding: 5,
        fontSize: 16,
        height: 26,
    },

    selectedItem: {
        padding: 5,
        fontSize: 16,
        height: 26,
        color: 'green'
    },

    container: {
        height: 200,
        width: 200
    },

    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'column',
        borderRadius: 25,
        maxHeight: 450, 
        width: 250,
    }
});
