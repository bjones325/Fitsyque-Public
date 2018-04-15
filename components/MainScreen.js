import React from 'react';
import { Text, View, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';

export default class Splash extends React.Component {
    render() {
        return (
            <View style={styles.background}>
                <Text style={styles.topText}>
                    Welcome back!
                </Text>
                <View style={styles.iconSet}>
                    <View style={styles.iconRow}>
                        <TouchableOpacity style={styles.touch} onPress={() => this.props.navigation.navigate('WorkoutsMain')}>
                            <Icon2 name="weight-kilogram" style={styles.icon} />
                            <Text> Workouts </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.touch} onPress={() => this.props.navigation.navigate('GraphScreen')}>
                            <Icon name="line-chart" style={styles.icon} />
                            <Text> Analysis </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity style={styles.touch} onPress={() => this.props.navigation.navigate('GoalsMain')}>
                            <Icon name="check-square" style={styles.icon} />
                                <Text> Goals </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.iconRow}>
                        <TouchableOpacity style={styles.touch} onPress={() => this.props.navigation.navigate('MacronutrientMain')}>
                            <Icon name="pie-chart" style={styles.icon} />
                            <Text> Macros </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.touch} onPress={() => this.props.navigation.navigate('ImageGallery')}>
                            <Icon2 name="ruler" style={styles.icon} />
                            <Text> Physique </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({


    topText: {
        flex: 1,
        color: 'silver',
        fontWeight: "300",
        fontSize: 34,
        paddingTop: 50,
    },

    background: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)'
    },

    iconSet: {
        flex: 2,
        flexDirection: 'column'
    },

    iconRow: {
        flexDirection: 'row',
        paddingVertical: 15,
    },

    icon: {
        alignSelf: 'center',
        fontSize: 64,
        color: 'darkblue'
    },

    touch: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 150
    }
});