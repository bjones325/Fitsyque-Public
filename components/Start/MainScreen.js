import React from 'react';
import { Text, View, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Drawer from 'react-native-drawer'
import Main from './Main';
import DrawerOptions from './DrawerOptions';

export default class Splash extends React.Component {

    constructor(props) {
        super(props);
        this.state= {
            openDrawer: false
        }
    }

    render() {
        return (
            <Drawer
                type="overlay"
                content={<DrawerOptions
                    navigation={this.props.navigation}
                    />}
                tapToClose={true}
                open={this.state.openDrawer}
                openDrawerOffset={0.4} // 20% gap on the right side of drawer
                panCloseMask={0.4}
                closedDrawerOffset={-3}
                styles={drawerStyles}
                onClose={() => {
                    this.setState({openDrawer: false})
                }}
                tweenHandler={(ratio) => ({
                    main: { opacity:(2-ratio)/2 }
                })}
                >
                    <Main
                        navigation={this.props.navigation}
                        openDrawer={() =>
                        this.setState({openDrawer: true})}/>
                </Drawer>
        );
    }
}

const drawerStyles = {
    drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
    main: {paddingLeft: 3},
  }