import React from 'react';
import { createStackNavigator, createDrawerNavigator, createAppContainer } from 'react-navigation';

// Screens
import HomeScreen from './screens/Home';
import AddWordScreen from './screens/AddWord';
import ViewWordScreen from './screens/ViewWord';
import SettingsScreen from './screens/Settings';

// Home Stack
const HomeStack = createStackNavigator(
    {
        Home: {
            screen: HomeScreen
        },
        AddWord: {
            screen: AddWordScreen
        },
        ViewWord: {
            screen: ViewWordScreen
        },
    },
    {
        initialRouteName: 'Home',
        headerMode: 'screen',
        headerStyle: {
        },
        defaultNavigationOptions: {
            header: null
        }
    }
)

// Drawer Navigator
const DrawerNavigator = createDrawerNavigator({
    Home: HomeStack,
    AddWord: {
        screen: AddWordScreen,
        navigationOptions: {
            drawerLabel: 'Add word',
        },
    },
    Settings: SettingsScreen,
});

// Root Stack
const RootStack = createStackNavigator (
    {
        DrawerNavigator: {
            screen: DrawerNavigator
        },
    },
    {
        defaultNavigationOptions: {
            header: null
        }
    }
)

const AppContainer = createAppContainer(RootStack);

export default class WordBin extends React.Component {
    render() {
        return <AppContainer />
    }
}
