import React from 'react';
import {Image, Text, TextField, View, Button, TextInput, StyleSheet, FlatList, TouchableOpacity, AsyncStorage} from 'react-native';
import { NavigationActions } from 'react-navigation';
var ImagePicker = require('react-native-image-picker');

export default class ImageModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            Calf: 0,
            Thigh: 0,
            Hip: 0,
            Waist: 0,
            Chest: 0,
            Bicep: 0,
            imageSource: null
        };
    }

    pushNewImage = () => {
        AsyncStorage.getItem('@app:session').then((token) => {
            return fetch('https://fitsyque.azurewebsites.net/Measurement/Push', {
                method: "post",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: JSON.stringify({
                    Calf: this.state.Calf,
                    Thigh: this.state.Thigh,
                    Hip: this.state.Hip,
                    Waist: this.state.Waist,
                    Chest: this.state.Chest,
                    Bicep: this.state.Bicep,
                    Date: this.props.date().toISOString().substring(0, 10),
                    Image: (this.state.imageSource != null ? 1 : 0)
                })
            })
        })
        .then((response) => 
            response.json()
        )
        .then((responseJson) => {
            if (!responseJson.success) {
                this.props.navigation.dispatch(resetB);
                alert(responseJson.message);
            } else {
                if(this.state.imageSource != null) {
                    AsyncStorage.setItem('@app:imageID:' + responseJson.id, this.state.imageSource.uri);
                }
                if (this.state.Waist/this.state.Hip > 0.95) {
                    this.props.onClose("warn", "Warning", "Your hip to waist ratio is very high. This might indicate a cardiovascular difficulty.");
                } else if(this.state.Waist/this.state.Hip < 0.7) {
                    this.props.onClose("warn", "Warning", "Your hip to waist ratio is low, which is overall dangerous to your health.");
                } else {
                    this.props.onClose("success", "Success", "Your measurements has been added!");
                }
            }
        })
        .catch((error) => {
            console.log(error);
            console.log(responseJson);
            this.setState({isVisible: false});
            this.props.onClose("error", "Internal Error", "There was an internal error while connecting! Please restart the app.")
        });
    }

    selectImage = () => {
        var options = {
            title: 'Select Image',
            storageOptions: {
              skipBackup: true,
              path: 'images'
            }
          };

        ImagePicker.showImagePicker(options, (response) => {
           
            if (response.didCancel) {
              console.log('User cancelled image picker');
            }
            else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            }
            else {
              let source = { uri: response.uri };
           
              // You can also display the image using data:
              // let source = { uri: 'data:image/jpeg;base64,' + response.data };
              this.setState({
                imageSource: source
              });
            }
          });
    }

    render() {
            return (
                <View style={styles.modalContainer}>
                <Text style={{paddingTop: 5, fontSize: 18}}>Set Workout Stats</Text>
                <Button
                    title="Import Image"
                    color="black"
                    onPress={
                        () => {
                            this.selectImage();
                        }
                    }
                    />
                <Image source={this.state.imageSource} style={styles.image} />
                <Button
                        title="Confirm"
                        color="green"
                        style={styles.confirmButton}
                        onPress={
                            () => {
                                this.pushNewImage();
                            }
                        }
                        />
            </View> 
            );
    }
};

const styles = StyleSheet.create({

    confirmButton: {
        color: 'green',
        borderRadius: 25,
    },

    image: {
        height: 75,
        width: 75
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

    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 25,
        height: 650, 
        width: 250,
    }
});
