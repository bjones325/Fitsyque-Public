import React from 'react';
import {TouchableOpacity, Image, Platform, Dimensions, Text, View, Button, TextInput, StyleSheet, SectionList, AsyncStorage, ListItem, Header} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Modal from "react-native-modal";
import ImageModal from "./ImageModal";
import TopBar from "../TopBar";
import DropdownAlert from 'react-native-dropdownalert';
import Icon from 'react-native-vector-icons/EvilIcons';
const WINDOW = Dimensions.get('window')


export default class ImageGallery extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isVisible: false,
            data: null,
            selectedData: null,
            imageIndex: null,
            imageData: null
        };
        this.requestImageData(new Date());
    }

    requestImageData = (date) => {
        AsyncStorage.getItem('@app:session').then((token) => {
            return fetch('https://fitsyque.azurewebsites.net/Measurement', {
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
                this.setState({
                    data: responseJson.data,
                    selectedData: responseJson.data[0],
                    imageIndex: 0
                });
                this.getImageData(0);
            }
        })
        .catch((error) => {
            console.log(error);
            this.setState({isVisible: false});
            alert("There was an internal error while connecting! Please restart the app.")
        });
    }

    getImageData = (index) => {
        if (index == null | this.state.data == null) {
            return null;
        }
        var data = this.state.data[index];
        if (data == null) return null;
        if (data.Image != 1) return null;
        AsyncStorage.getItem("@app:imageID:" + data.RecordID).then((val) => {
            this.setState({imageData: {uri: val}});
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <TopBar nav={this.props.navigation} onRef={ref => (this.topBar = ref)} getData={(date) => this.requestImageData(date)}
                    plusPress={() => this.setState({isVisible: true})} />
                <TouchableOpacity onPress={() => {
                    var index = this.state.imageIndex;
                    index = index - 1 < 0 ? 0 : index - 1;
                    this.setState({imageIndex: index});
                    this.getImageData(index);
                }}>
                    <Icon name="chevron-left" style={{fontSize: 36}}/>
                </TouchableOpacity >
                <Text> {this.state.imageIndex} </Text>
                <Image source={this.state.imageData} style={{ width: 150, height: 150 }} />
                <TouchableOpacity onPress={() => {
                    var index = this.state.imageIndex;
                    index = index + 2 < this.state.data.length ? index + 1 : this.state.data.length;
                    this.setState({imageIndex: index});
                    this.getImageData(index);
                }}>
                    <Icon name="chevron-right" style={{fontSize: 36}}/>
                </TouchableOpacity >
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
                    <ImageModal
                        date={() => this.topBar.getDate()}
                        onClose={(type, header, text) => {
                            this.setState({isVisible: false})
                            this.requestImageData(this.topBar.getDate());
                            this.dropdown.alertWithType(type, header, text);
                        }}/>
                </Modal>
                <DropdownAlert     defaultContainer={{ padding: 8, paddingTop: Platform.OS === 'android' ? 0 : 10, flexDirection: 'row' }}
                ref={ref => this.dropdown = ref} startDelta={WINDOW.height + 200} endDelta={WINDOW.height}/>
            </View>
        );
    }
};

const resetB = NavigationActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName: 'MainScreen'})],
});

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    modal: {
        justifyContent: 'center',
        alignSelf: 'center',
        flex: 1
    },
});