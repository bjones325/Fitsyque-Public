import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Button } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import Modal from "react-native-modal";
import { Calendar } from 'react-native-calendars';
import NetworkCall from './Network';

export default class WorkoutsMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            jumpDate: new Date(),
            calendarMonth: new Date(),
            dotDates: {}
        };
        this.getDotDates();
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    getDate = () => {
        return this.state.date;
    }

    getDotDates = () => {
        if (this.props.dotURL) {
            var call = new NetworkCall();
            call.url = this.props.dotURL
            call.type = "get"
            call.extraHeaders = {
                date: this.state.calendarMonth.toISOString().substring(0, 10)
            }
            call.onSuccess = (responseJson) => {
                var parsedDates = {}
                responseJson.data.map(item => {
                    parsedDates[item.Date.substring(0, 10)] = {marked: true, dotColor: 'red'}
                })
                this.setState({
                    dotDates: parsedDates
                })
            }
            call.execute(true);
        }
    }

    getMarkedDates = () => {
        var dates = Object.assign({}, this.state.dotDates);
        dates[this.state.jumpDate.toISOString().substring(0, 10)] = Object.assign({selected: true}, dates[this.state.jumpDate.toISOString().substring(0, 10)]);
        return dates;
    }

    render() {
        return (
            <View style={styles.barView}>
                <View style={styles.invisible}>
                    <TouchableOpacity onPress={() => this.props.nav.goBack()}>
                        <Icon name='arrow-left' style={styles.iconType} />
                    </TouchableOpacity >
                </View>
                <View style={styles.centerBar}>
                    <TouchableOpacity onPress={() => {
                        var date = this.state.date;
                        date.setDate(date.getDate() - 1);
                        this.setState({ date: date });
                        this.props.getData(date);
                    }}>
                        <Icon name="chevron-left" style={{ fontSize: 36 }} />
                    </TouchableOpacity >
                    <TouchableOpacity onPress={() => {
                        this.setState({
                            visible: true
                        })
                    }}>
                        <Text style={styles.text}>
                            {this.state.date.toISOString().substring(0, 10)}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        var date = this.state.date;
                        date.setDate(date.getDate() + 1);
                        this.setState({ date: date });
                        this.props.getData(date);
                    }}>
                        <Icon name="chevron-right" style={{ fontSize: 36 }} />
                    </TouchableOpacity>
                </View>
                <View style={styles.endBar}>
                {this.props.endIcon ?
                    <TouchableOpacity style={styles.icon} onPress={() => {
                        this.props.plusPress();
                    }}>
                        <Icon name="plus" style={styles.iconType} />
                    </TouchableOpacity>
                :
                    <View />
                }
                </View>
                <Modal
                    isVisible={this.state.visible}
                    style = {styles.modal}
                    backdropColor = 'gray'
                    backdropOpacity = {0.5}
                    onBackdropPress = {() => {
                        this.setState({visible: false})
                    }}
                    animationIn = "fadeIn"
                    animationOut = "fadeOut">
                    <View style={styles.modalContainer}>
                        <Text style={{ paddingTop: 10, fontSize: 24, paddingBottom: 10, fontWeight: '600' }}>Select a Date</Text>
                        <Calendar
                            markedDates={
                                this.getMarkedDates()
                            }
                            onDayPress={(day) => {
                                this.setState({
                                    jumpDate: new Date(day.dateString)
                                })
                            }}
                            monthFormat={'MM-yyyy'}
                            hideExtraDays={true}
                            firstDay={1}
                            hideDayNames={true}
                            onPressArrowLeft={substractMonth => {   
                                var date = this.state.calendarMonth;
                                date.setMonth(date.getMonth() - 1);
                                this.setState({ calendarMonth: date });
                                this.getDotDates();
                                substractMonth();
                            }}
                            onPressArrowRight={addMonth => {
                                var date = this.state.calendarMonth;
                                date.setMonth(date.getMonth() + 1);
                                this.setState({ calendarMonth: date });
                                this.getDotDates();
                                addMonth();
                            }}
                            />
                        <Button title="Jump to Date" onPress={() => {
                            this.setState({
                                date: this.state.jumpDate,
                                visible: false
                            })
                            console.log("Calendar JUmp")
                            console.log(this.state.jumpDate);
                            console.log("-----")
                            this.props.getData(this.state.jumpDate);
                        }}/>
                    </View>
                </Modal>
            </View>
            
        );
    }
}

const styles = StyleSheet.create({

    text: {
        color: 'red', //#841584
        fontWeight: "400",
        fontSize: 24,
    },

    invisible: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
    },

    centerBar: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },

    barView: {
        maxHeight: 50,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        marginHorizontal: 5
    },

    endBar: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
    },

    icon: {
        justifyContent: 'flex-end',
    },

    iconType: {
        fontSize: 36,
        color: 'silver'
    },

    modal: {
        justifyContent: 'center',
        alignSelf: 'center',
        flex: 1
    },

    modalContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: 'white',
        borderRadius: 25,
        height: 400,
        width: 250,
    },
});