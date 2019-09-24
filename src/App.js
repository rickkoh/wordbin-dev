import React from 'react';
import { createStackNavigator, createDrawerNavigator, createAppContainer } from 'react-navigation';

import WordBin from './Router';

export default class App extends React.Component {
    render() {
        return <WordBin />
    }
}
