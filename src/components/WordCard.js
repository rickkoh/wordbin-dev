import React from 'react';
import { View, DeviceEventEmitter, StyleSheet, Text, FlatList } from 'react-native';
import { withNavigation } from 'react-navigation';

import { colors } from '../Styles';

import Tag from './Tag';
import { TouchableOpacity } from 'react-native-gesture-handler';
import database from '../services/Database';

class WordCard extends React.Component {

    cleanString() {
        this.cleanTag();
    }

    cleanTag() {
        if (this.props.word.Tags.length > 0 && this.props.word.Tags[0].tag_title != "Tags: ") {
            this.props.word.Tags.unshift({tag_title: "Tags: "})
        }
    }

    render() {
        
        this.cleanString();

        return(
            <TouchableOpacity onPress={() => console.log(this.props.word.word_text)}>
                <View style={{ minHeight: 20, margin: 10, marginBottom: 0, padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#e1edf0', backgroundColor: colors.default.backgroundColor}}>
                    <View style={{alignItems: 'flex-end'}}>
                        <TouchableOpacity style={{marginLeft: 10, marginRight: 5}} onPress={() => {
                            database.deleteWord(this.props.word.word_id).then(() => DeviceEventEmitter.emit('database_changed'));
                        }}>
                            <Text style={{fontWeight: 'bold'}}>. . .</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize: 20, marginBottom: 5 }}>{this.props.word.word_text}</Text>
                    {this.props.word.word_pronunciation == undefined ? null : (
                        <Text style={{fontSize: 12, marginBottom: 5 }}>{this.props.word.word_pronunciation}</Text>
                    )}
                    <FlatList
                        data={this.props.word.Meanings}
                        renderItem={this.renderMeaning}
                        keyExtractor={(item, index) => index.toString()}
                        listKey={(item, index) => index.toString()}
                    />
                    <FlatList
                        data={this.props.word.Tags}
                        style={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center'}}
                        renderItem={this.renderTag} 
                        keyExtractor={(item, index) => index.toString()}
                        listKey={(item, index) => index.toString()}
                    />
                </View>
            </TouchableOpacity>
        )
    }

    renderMeaning = ({item, index}) => {
        synonym = [{text: "Synonyms:"}]
        return(
            <View>
                {item.meaning_classification == undefined ? null : (
                    <Text style={{fontSize: 12, marginBottom: 5, color: 'gray'}}>{item.meaning_classification}</Text>
                )}
                <Text style={{fontSize: 14, marginBottom: 7.5 }}>{item.meaning_text}</Text>
                {synonym.length <= 1 ? null : (
                    <FlatList
                        data={synonym}
                        style={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center'}}
                        renderItem={this.renderTag} 
                        keyExtractor={(item, index) => index.toString()}
                        listKey={(item, index) => index.toString()}
                    />
                )}
            </View>
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
                <TouchableOpacity onPress={() => DeviceEventEmitter.emit("change_title", (item.tag_title))}>
                    <Tag value={item.tag_title}/>
                </TouchableOpacity>
            )
        }
    }    
    
}

const styles = StyleSheet.create({
    
})

export default withNavigation(WordCard);