import React from 'react';
import { View, Text, FlatList } from 'react-native';

class MeaningInformation extends React.Component {

    render() {
        return(
            <FlatList
                data={this.props.data}
                renderItem={this.renderMeaning}
                keyExtractor={(item, index) => index.toString()}
                listKey={(item, index) => index.toString()}
            />
        )
    }

    // Render the following (in order):
    // Classification,
    // Meaning,
    // Synonyms,
    renderMeaning = ({item, index}) => {
        synonym = [{text: "Synonyms:"}]
        return(
            <View>
                {item.meaning_classification == undefined ? null : (
                    <Text style={{fontSize: 12, marginBottom: 5, color: 'gray'}}>{item.meaning_classification}</Text>
                )}
                <Text style={{fontSize: 14, marginBottom: 7.5 }}>{item.meaning_text}</Text>
                {
                    // synonym.length <= 1 ? null : (
                        // <FlatList
                            // data={synonym}
                            // style={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center'}}
                            // renderItem={this.renderSynonym} 
                            // keyExtractor={(item, index) => index.toString()}
                            // listKey={(item, index) => index.toString()}
                        // />
                    // )
                }
            </View>
        )
    }

    renderSynonym = ({item, index}) => {
        if (index==0) {
            // Render tag header
            return (
                <View style={{marginRight: 5, marginBottom: 10}}>
                    <Text style={{fontSize: 12, color: 'green'}}>{item.word_text}</Text>
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

export default MeaningInformation;