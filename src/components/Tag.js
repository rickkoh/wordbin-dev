import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../Styles';

class Tag extends React.Component {
    
    render() {
        return(
            <View style={{marginRight: 5, marginBottom: 10,  borderRadius: 20, backgroundColor: colors.default.backgroundColor, borderWidth: 1, borderColor: colors.default.lightgray}}>
                <Text style={{padding: 5, fontSize: 12 }}>{this.props.value}</Text>
            </View>
        )
    }
}

export default Tag;