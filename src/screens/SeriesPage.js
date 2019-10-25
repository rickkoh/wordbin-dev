import React from 'react';
import { View, Text } from 'react-native';

class SeriesPage extends React.Component {

    constructor(props){
        super(props);
    }

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