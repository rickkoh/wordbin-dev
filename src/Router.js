import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator, createDrawerNavigator, createAppContainer, DrawerItems } from 'react-navigation';

// Components
import SideMenu from './components/Navigation/SideMenu';

// Screens
import HomeScreen from './screens/Home';
import AddWordScreen from './screens/AddWord';
import ViewWordScreen from './screens/ViewWord';
import SettingsScreen from './screens/Settings';

// Home Stack
// Contains the screens that Home can navigate to
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
        defaultNavigationOptions: {
            header: null
        }
    }
)

// Drawer Navigator
const DrawerNavigator = createDrawerNavigator({
    Home: HomeStack,
    //AddWord: {
        //screen: AddWordScreen,
        //navigationOptions: {
            //drawerLabel: 'Add word',
        //},
    //},
    //Settings: SettingsScreen,
},
{
    contentComponent: props => 
        <View style={{paddingTop: 44}}>
            <DrawerItems {...props} />
            <SideMenu/>
        </View>
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
