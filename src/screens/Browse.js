import React from 'react';
import { View, Text } from 'react-native';

import Header from '../components/Header';
import PillButton from '../components/PillButton';

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
                <View style={{top: -15, alignItems: 'center'}}>
                    <PillButton text="Add Word"
                        style={{backgroundColor: colors.default.red}}
                    />
                </View>
            </View>
        )
    }
}

export default Browse;