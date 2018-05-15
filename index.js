import { AppRegistry } from 'react-native';
import React, { Component } from 'react';
import { RootStack } from './components/Router';
import NavigationService from './components/NavigationService';

export default class App extends Component {
    render() {
        return <RootStack ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}/>;
    }
}

AppRegistry.registerComponent('Fitsyque', () => App);
