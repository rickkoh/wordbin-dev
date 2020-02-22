import React from 'react';
import { View, Text, FlatList } from 'react-native';

class SynonymInformation extends React.Component {

    render() {
            <FlatList
                data={this.props.data}
                style={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center'}}
                renderItem={this.renderSynonym} 
                keyExtractor={(item, index) => index.toString()}
                listKey={(item, index) => index.toString()}
            />
    }

    renderSynonym = ({item, index}) => {
        if (index==0) {
            // Render tag header
            // Usually the class file that uses this component will add a dummy title 'item' to display the header text
            return (
                <View style={{marginRight: 5, marginBottom: 10}}>
                    <Text style={{fontSize: 12, color: 'green'}}>{item.word_text}</Text>
                </View>
            )
        } else {
            // Render synonym
            return (
                // Define what happens after clicking on the synonym
                // Open up the word card? Makes sense
                // What if the synonym have no information only the word_text
                <TouchableOpacity onPress={() => DeviceEventEmitter.emit("change_synonym", (item))}>
                    <Tag value={item.word_text} style={{marginRight: 5, marginBottom: 10}}/>
                </TouchableOpacity>
            )
        }
    }    
}