import React from 'react';
import { View, Text, FlatList, ScrollView, ListView } from 'react-native';

import { colors } from '../Styles';

import HorizontalList from './HorizontalList';

import Tag from './Tag';

class WordCard extends React.Component {
    render() {

    temp_tags = [{text: "Tags: "}, {text: "English"}, {text: "Language"}, {text: "Fundamentals"}];
        
        return(
                <View style={{ minHeight: 20, margin: 10, marginBottom: 0, padding: 10, borderRadius: 5, borderWidth: 1, borderColor: colors.default.lightgray}}>
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
                        data={temp_tags}
                        style={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center'}}
                        renderItem={this.renderTag} 
                        keyExtractor={(item, index) => index.toString()}
                        listKey={(item, index) => index.toString()}
                    />
                </View>
        )
    }

    renderMeaning = ({item, index}) => {
        synonym = [{text: "Synonyms:"}]
        return(
            <View>
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
            return (
                <View style={{marginRight: 5, marginBottom: 10}}>
                    <Text style={{fontSize: 12, color: 'green'}}>{item.text}</Text>
                </View>
            )
        } else {
            return (
                <Tag value={item.text}/>
            )
        }
    }
}

class MeaningItem extends React.Component {
    render() {
        return(
            <View>
                <Text style={{fontSize: 14, marginBottom: 7.5 }}>{this.prop.item.meaning_text}</Text>
                <FlatList
                    data={this.prop.item.Synonyms}
                    style={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center'}}
                    renderItem={this.renderTag} 
                    keyExtractor={(item, index) => index.toString()}
                    listKey={(item, index) => index.toString()}
                />
            </View>
        )
    }
}

class TagItem extends React.Component {
    render() {
        return(
            null
        )
    }
}

export default WordCard;