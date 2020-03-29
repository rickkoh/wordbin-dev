import { StyleSheet, Platform, Dimensions } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const dim = Dimensions.get('window');
export const STATUS_BAR_HEIGHT = Platform.OS === 'ios'
                        ? isIphoneXSize() || isIphoneXrSize()
                        ? 44 // Is IphoneX or IphoneXr
                        : 20 // Not IphoneX nor IphoneXr
                        : 24 // Not ios

export const SCREEN_HEIGHT = dim.height;
export const SCREEN_WIDTH = dim.width;

function isIphoneXSize() {
    console.log(dim.height);
    return SCREEN_HEIGHT == 812 || SCREEN_WIDTH == 812;
}

function isIphoneXrSize() {
    return SCREEN_HEIGHT == 896 || SCREEN_WIDTH == 896;
}

export const colors = {
    default: {
        backgroundColor: '#F8F8F7',
        primaryColor: 'black',
        secondaryColor: 'darkgray',
        tertiaryColor: 'lightgray',
        white: 'white',
        black: 'black',
        red: '#e74c3c',
        blue: '#41a4ea',
        green: 'green',
        lightred: '#e86e6e',
        gray: '#d2d2d8',
        lightgray: '#DFE1E5',
    },
}

export const headerStyles = StyleSheet.create({
    header: {
        height: getStatusBarHeight() + 44,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    headerLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
    },
    headerCenter: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    headerRight: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    headerButtonLeft:{
        marginLeft: 20,
        alignItems: 'center',
    },
    headerButtonRight:{
        marginRight: 20,
        alignItems: 'center',
    },
    headerTitle: {
        color: colors.default.primaryColor,
        fontSize: 17,
        marginBottom: 2,
        fontWeight: 'bold',
        maxHeight: 20,
    },
    headerTextLeft:{
        paddingLeft: 20,
        justifyContent: 'center',
    },
    headerTextRight:{
        paddingRight: 20,
        justifyContent: 'center',
    },
})