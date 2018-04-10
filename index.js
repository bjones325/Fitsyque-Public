import { AppRegistry } from 'react-native';
import React, { Component } from 'react';
import { RootStack } from './components/Router';

export default class App extends Component {
    render() {
        return <RootStack />;
    }
}

AppRegistry.registerComponent('Fitsyque', () => App);
