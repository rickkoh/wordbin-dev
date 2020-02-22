import React from 'react';
import { View, Text, FlatList, TouchableOpacity, DeviceEventEmitter } from 'react-native';

import Tag from '../Tag';

class TagInformation extends React.Component {

    render() {
        return(
            <FlatList
                data={this.props.data}
                contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center'}}
                renderItem={this.renderTag} 
                keyExtractor={(item, index) => index.toString()}
                listKey={(item, index) => index.toString()}
            />
        )
    }

    renderTag = ({item, index}) => {
        if (index==0) {
            // Render tag header
            return (
                <View style={{marginRight: 5, marginBottom: 10}}>
                    <Text style={{fontSize: 12, color: 'green'}}>{item.tag_title}</Text>
                </View>
            )
        } else {
            // Render tag
            return (
                <TouchableOpacity onPress={() => DeviceEventEmitter.emit("change_title", (item))}>
                    <Tag value={item.tag_title} style={{marginRight: 5, marginBottom: 10}}/>
                </TouchableOpacity>
            )
        }
    }    
}

export default TagInformation;