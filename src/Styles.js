import React from 'react';
import { StyleSheet } from 'react-native';
import { Header } from 'react-navigation';
import { getStatusBarHeight } from 'react-native-status-bar-height';

export const colors = {
    default: {
        backgroundColor: '#fefefe',
        primaryColor: 'black',
        secondaryColor: 'darkgray',
        tertiaryColor: 'lightgray',
        black: 'black',
        blue: '#41a4ea',
        red: '#e74c3c',
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

export const buttonStyles = StyleSheet.create({
    addButton: {
        borderWidth: 1,
        backgroundColor: colors.default.blue,
        borderColor: colors.default.blue,
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 3,
        marginRight: 22.5, opacity: 0.25,
    },
})
