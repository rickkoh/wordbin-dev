import React from 'react';
import { View, ImageBackground, StyleSheet, Text } from 'react-native';

import { colors, SCREEN_HEIGHT } from '../Styles';

export default function AddWordCard(props) {
    return(
        <View style={[styles.boxWithShadow, styles.card]} onPress={() => props.onPress()}>
            {
            <ImageBackground style={[styles.container, styles.center]} source={{uri: "INSERT LOCAL IMAGE URL HERE"}} resizeMode="cover">
                <Text>Hi</Text>
            </ImageBackground>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        margin: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: colors.default.white,
        height: SCREEN_HEIGHT * 0.725,
    },
    boxWithShadow: {
        marginBottom: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
})