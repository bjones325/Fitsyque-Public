import React from 'react';
import { Text, View, Button, TextInput, StyleSheet, TouchableOpacity, ImageBackground} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import {YellowBox} from 'react-native';



export default class Splash extends React.Component {

    constructor(props) {
        super(props);
        console.disableYellowBox = true;
    }

    render() {
        return (
            <ImageBackground
            style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            source={require("../Assets/main.jpeg")}
            >
                    <TouchableOpacity style={{
                        padding: 20,
                        alignSelf: 'flex-end'
                    }} onPress={() => this.props.openDrawer()}>
                        <Icon name="cog" style={styles.options} />
                    </TouchableOpacity>
                <Text style={styles.topText}>
                        Welcome back
                </Text>
                <View style={styles.iconSet}>
                    <View style={styles.iconRow}>
                        <TouchableOpacity style={styles.touch} onPress={() => this.props.navigation.navigate('WorkoutsMain')}>
                            <Icon2 name="weight-kilogram" style={styles.icon} />
                            <Text style={styles.text}> Workouts </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.touch} onPress={() => this.props.navigation.navigate('GraphScreen')}>
                            <Icon name="line-chart" style={styles.icon} />
                            <Text style={styles.text}> Analysis </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity style={styles.touch} onPress={() => this.props.navigation.navigate('GoalsMain')}>
                            <Icon name="check-square" style={styles.icon} />
                            <Text style={styles.text}> Goals </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.iconRow}>
                        <TouchableOpacity style={styles.touch} onPress={() => this.props.navigation.navigate('MacronutrientMain')}>
                            <Icon name="pie-chart" style={styles.icon} />
                            <Text style={styles.text}> Macros </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.touch} onPress={() => this.props.navigation.navigate('ImageGallery')}>
                            <Icon2 name="ruler" style={styles.icon} />
                            <Text style={styles.text}> Physique </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    topText: {
        flex: 1,
        color: 'silver',
        fontWeight: "300",
        fontSize: 34,
        paddingTop: 20,
    },

    background: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)'
    },

    iconSet: {
        flex: 4,
        flexDirection: 'column'
    },

    iconRow: {
        flexDirection: 'row',
        paddingVertical: 15,
    },

    icon: {
        alignSelf: 'center',
        fontSize: 64,
        color: 'firebrick'
    },

    touch: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 150,
    },

    options: {
        justifyContent: 'flex-end',
        fontSize: 24,
        color: 'silver',
    },

    text: {
        color: 'firebrick',
        fontWeight: 'bold',
        fontSize: 18,
    }

});