import React from 'react';
import { View, StyleSheet, ListView, Text, Animated } from 'react-native';

import Header from '../components/Header';
import PillButton from '../components/PillButton';
import TextList from '../components/TextList';

import { colors } from '../Styles';


class Browse extends React.Component {
    render() {
        return(
            <View style={{flex: 1}}>
                <Header
                    backgroundColor='pink'
                />
                <View style={{height: 170, alignItems: 'center', justifyContent: 'center', backgroundColor: 'pink'}}>
                    <Text style={{bottom: 25, fontSize: 26, fontWeight: 'bold', color: "white"}}>My Series</Text>
                </View>
                <View style={{top: -20, alignItems: 'center'}}>
                    <View style={{backgroundColor: 'pink', borderRadius: 25}}>
                        <PillButton style={styles.headerButton} text="Add Series"/>
                    </View>
                </View>
                <TextList/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {

    },
    headerButton: {
        backgroundColor: colors.default.red,
        paddingHorizontal: 40,
        paddingVertical: 10
    },
})

export default Browse;