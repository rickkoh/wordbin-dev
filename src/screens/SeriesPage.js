import React from 'react';
import { View, Text } from 'react-native';

class SeriesPage extends React.Component {

    constructor(props){
        super(props);
    }

    // Use Animation get the scrolling effect
    // Once the scrolling effect is done do it on home screen

    render() {
        return(
            <View style={{flex: 1}}>
                <View style={{height: 250, alignItems: 'center', justifyContent: 'center', backgroundColor: 'pink'}}>
                    <Text>Series</Text>
                </View>
                <View>
                    <Text>Data</Text>
                </View>
            </View>
        )
    }
}

export default SeriesPage;