import React from 'react';
import { View, Text } from 'react-native';
import { createAppContainer, DrawerItems } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';

// Components
import SideMenu from './components/Navigation/SideMenu';

// Screens
import HomeScreen from './screens/Home';
import AddWordScreen from './screens/AddWord';
import Browse from './screens/Browse';
import SeriesPage from './screens/SeriesPage';
import WordPage from './screens/WordPage';
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
        WordPage: {
            screen: WordPage
        },
        SeriesPage: {
            screen: SeriesPage
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
    // Profile: {
        // screen: Profile
    // },
    // Browse: {
        // screen: Browse
    // },
    //AddWord: {
        //screen: AddWordScreen,
        //navigationOptions: {
            //drawerLabel: 'Add word',
        //},
    //},
    Settings: SettingsScreen,
},
{
    contentComponent: props => 
        <View style={{paddingTop: 44, flex: 1}}>
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
