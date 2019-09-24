import React from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, View, Button, Alert, Picker, TouchableOpacity, ScrollView, FlatList, Dimensions } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import { Icon } from 'react-native-elements';
import { SQLite } from 'expo-sqlite';

import { colors, headerStyles, buttonStyles } from '../Styles';
import { SCREEN_WIDTH } from '../Measurements';

import Header from '../components/Header';
import ClearButton from '../components/ClearButton';
import PillButton from '../components/PillButton';

import database from '../services/Database';

class AddWordScreen extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            word: {
                word_id: undefined,
                word_text: undefined,
                word_class: undefined,
                word_pronounciation: undefined,
                word_origin: undefined,
                word_datetimeadded: undefined,
            },
            meaning: [
                {
                    meaning_id: undefined,
                    meaning_text: undefined,
                    meaning_classification: undefined,
                    meaning_datetimecreated: undefined,
                }
            ],
            tags: [
                {
                    tag: undefined,
                }
            ],
            datetimeadded: undefined,
            meaningCurrentIndex: undefined,
            keyboardBarType: undefined,
            wordIsValidated: false,
            wordHasAPIdata: false,
            isValidated: false,
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.word.word_text != undefined && this.state.word.word_text != "") {
            if (prevState.isValidated != true) this.setState({ isValidated: true });
        } else {
            if (prevState.isValidated != false) this.setState({ isValidated: false });
        }
    }

    handleWordChange = (text) => {
        this.state.word.word_text = text;
        this.setState({ word: this.state.word });
    }

    handlePronounciationChange = (text) => {
        this.state.word.word_pronounciation = text;
        this.setState({ word: this.state.word });
    }

    handleMeaningChange = (text, index) => {
        meaning = this.state.meaning;
        meaning[index].meaning_text = text;

        if (index == meaning.length-1) {
            if (meaning[index].meaning_text != "" && meaning[index].meaning_text != undefined) {
                meaning = meaning.concat({meaning_id: undefined, meaning_text: undefined, meaning_classification: undefined, meaning_datetimecreated: undefined});
            }
        } else {
            // Fix: This method implemented causes confusion in the user as the user keeps backspacing
            if (meaning[index].meaning_text == "" || meaning[index].meaning_text == undefined) {
                meaning.splice(index, 1);
            }
        }

        this.setState({ meaning: meaning });
    }

    removeMeaning = () => {
        meaning = this.state.meaning;
        console.log(this.state.meaningCurrentIndex);
        meaning.splice(this.state.meaningCurrentIndex, 1);
        this.setState({ meaning: meaning })
    }

    handleTagChange = (text) => {
        if (text.length > 1 && text[text.length-1] == " "){
            this.addTag();
        } else {
            tags = this.state.tags;
            tags[tags.length-1].tag = text;
            this.setState({ tags: tags });
        }
    }

    handleOriginChange = (text) => {
        this.state.word.word_origin = text;
        this.setState({ word: this.state.word });
    }

    addTag = () => {
        tags = this.state.tags;
        text = tags[tags.length-1].tag;
        if (text != undefined && text.length>0) {
            tags = tags.concat({tag: undefined});
            this.setState({ tags: tags });
        }
    }

    removeTag = (index) => {
        tags = this.state.tags;
        tags.splice(index, 1);
        this.setState({ tags: tags });
    }

    handleTypeChange = (text, index) => {
        meaning = this.state.meaning;
        meaning[index].type = text;
    }

    addButtonPressed = () => {
        this.state.word.word_id = database.addWord(this.state.word);
        console.log(this.state.word);
    }

    renderKeyboardBar = () => {
        return(
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <TouchableOpacity>
                        <Icon name='package' type='feather' color={colors.default.blue} opacity={this.state.wordHasAPIdata ? 1 : 0.25}/>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                    <TouchableOpacity style={{marginRight: 15}} onPress={() => this.setState({ word: {word_text: undefined, datetimeadded: undefined} })}>
                        <Text style={{fontSize: 16, color: colors.default.blue}}>Clear</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                    <TouchableOpacity onPress={() => {this.meaningInput.scrollToIndex(this.state.meaningCurrentIndex - 1)}}>
                        <Icon name='chevron-left' color={colors.default.blue} size={22} opacity={0.25}/>
                    </TouchableOpacity>
                    <Text style={{fontSize: 16, color: colors.default.blue}}>{this.state.meaningCurrentIndex + 1}/{this.state.meaning.length}</Text>
                    <TouchableOpacity onPress={() => {this.meaningInput.scrollToIndex(this.state.meaningCurrentIndex + 1)}}>
                        <Icon name='chevron-right' color={colors.default.blue} size={22} opacity={0.25}/>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <TouchableOpacity>
                        <Icon name='add' color={colors.default.blue}/>
                    </TouchableOpacity>
                </View>
            </View>)
    }

    render() {
        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
                <Header
                    headerLeft={
                        <TouchableOpacity
                            onPress={() => this.props.navigation.goBack()}
                            style={headerStyles.headerButtonLeft}>
                            <Text numberOfLines={1} style={{color: colors.default.blue, fontSize: 16}}>Cancel</Text>
                        </TouchableOpacity>
                    }
                    headerTitle={
                        <Text style={headerStyles.headerTitle}>{this.props.title}</Text>
                    }
                    headerRight={
                        <PillButton
                            text="Add"
                            style={headerStyles.headerButtonRight}
                            enabled={this.state.isValidated}
                            onPress={this.addButtonPressed}
                        />
                    }
                />
                <WordInput
                    ref={(ref) => { this.wordInput = ref }}
                    value={this.state.word.word_text}
                    onChangeText={this.handleWordChange}
                    onFocus={() => this.setState({ keyboardBarType: 'word' })}
                />
                <PronounciationInput
                    ref={(ref) => { this.pronounciationInput = ref }}
                    value={this.state.word.word_pronounciation}
                    onChangeText={this.handlePronounciationChange}
                    onFocus={() => this.setState({ keyboardBarType: 'word' })}
                />
                <MeaningInput
                    ref={(ref) => { this.meaningInput = ref }}
                    data={this.state.meaning}
                    onIndexChange={(index) => this.setState({ meaningCurrentIndex:index })}
                    onChangeText={this.handleMeaningChange}
                    onFocus={() => this.setState({ keyboardBarType: 'meaning' })}
                />
                <TagInput
                    ref={(ref) => { this.tagInput = ref }}
                    value={this.state.tags[this.state.tags.length-1].tag}
                    data={this.state.tags}
                    onChangeText={this.handleTagChange}
                    onPress={this.removeTag}
                    onFocus={() => this.setState({ keyboardBarType: 'tag' })}
                    onBlur={this.addTag}
                />
                <KeyboardBar
                    renderContent={this.renderKeyboardBar()}
                    enabled={this.state.isValidated}
                />
            </KeyboardAvoidingView>
        )
    }
}

class WordInput extends React.Component {

    componentDidMount() {
        this.wordInput.focus();
    }

    wordTextInputStyle = function(){
        return {
            height: 40,
            fontSize: 26,
            paddingHorizontal: 20,
        }
    }

    render() {
        return(
            <TextInput
                ref={(input) => { this.wordInput = input; }}
                style={this.wordTextInputStyle()}
                value={this.props.value}
                onFocus={this.props.onFocus}
                placeholder="Word"
                onChangeText={(text) => this.props.onChangeText(text)}
            />
        )
    }

}

class PronounciationInput extends React.Component {

    wordTextInputStyle = function(){
        return {
            height: 40,
            fontSize: 14,
            paddingHorizontal: 20,
        }
    }

    render() {
        return(
            <TextInput
                ref={(input) => { this.wordInput = input; }}
                style={this.wordTextInputStyle()}
                value={this.props.value}
                onFocus={this.props.onFocus}
                placeholder="/  Pronounciation  /"
                onChangeText={(text) => this.props.onChangeText(text)}
            />
        )
    }

}

class OriginInput extends React.Component {

    wordTextInputStyle = function(){
        return {
            height: 30,
            fontSize: 16,
            paddingHorizontal: 20,
        }
    }

    render() {
        return(
            <TextInput
                ref={(input) => { this.wordInput = input; }}
                style={this.wordTextInputStyle()}
                value={this.props.value}
                onFocus={this.props.onFocus}
                placeholder="Origin"
                onChangeText={(text) => this.props.onChangeText(text)}
            />
        )
    }

}

class MeaningInput extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            currentIndex: 1,
        }
    }

    scrollToIndex = (index, animated) => {
        this.flatList.scrollToIndex({animated: animated, index: index});
    }

    renderMeaningItem = ({item, index}) => {
        return(
            <TextInput
                multiline
                style={{width: SCREEN_WIDTH, flex: 1, fontSize: 16, paddingHorizontal: 20, textAlignVertical: 'top'}}
                value={item.meaning}
                onFocus={this.props.onFocus}
                placeholder="Meaning of word"
                onChangeText={(text) => this.props.onChangeText(text, index)}
            />
        )
    }

    onViewableItemsChanged = ({ viewableItems }) => {
        this.setState({ currentIndex: viewableItems[0].index + 1 });
        this.props.onIndexChange(viewableItems[0].index);
    }

    render() {
        return(
            <FlatList
                horizontal
                pagingEnabled
                style={{ flex: 1 }}
                showsHorizontalScrollIndicator={false}
                ref={(ref) => { this.flatList = ref }}
                data={this.props.data}
                renderItem={this.renderMeaningItem}
                onViewableItemsChanged={this.onViewableItemsChanged}
                keyExtractor={(item, index) => index.toString()}
                listKey={(item, index) => index.toString()}
            />
        )
    }
}

class TagInput extends React.Component {

    tagTextInputStyle = function() {
        return {
            height: 40,
            paddingHorizontal: 20,
            fontSize: 16,
        }
    }

    scrollToIndex = (index, animated) => {
        this.flatList.scrollToIndex({animated: animated, index: index});
    }

    renderTagList = () => {
        data = [...this.props.data];
        data.splice(data.length-1);
        return(
            <FlatList
                data={data}
                ref={(ref) => this.flatList = ref}
                contentContainerStyle={{paddingHorizontal: 20, flexDirection: 'row', flexWrap: 'wrap', width: SCREEN_WIDTH}}
                renderItem={this.renderTagItem}
                keyExtractor={(item, index) => index.toString()}
                listKey={(item, index) => index.toString()}
            />
        )
    }

    renderTagItem = ({item, index}) => {
        return(
            <View style={{marginRight: 5, marginBottom: 10, flexDirection: 'row',  borderRadius: 5, backgroundColor: '#f4f7f8'}}>
                <Text style={{padding: 5, paddingRight: 0}}>{item.tag}</Text>
                <ClearButton
                    color='lightgray'
                    onPress={() => this.props.onPress(index)}
                />
            </View>
        )
    }

    render() {
        return(
            <View style={{ maxHeight: 160 }}>
                <TextInput
                    style={this.tagTextInputStyle()}
                    value={this.props.value}
                    placeholder="Tags"
                    onChangeText={(text) => this.props.onChangeText(text)}
                    onBlur={this.props.onBlur}
                    onFocus={this.props.onFocus}
                />
                {this.renderTagList()}
            </View>
        )
    }
}

class KeyboardBar extends React.Component {

    render() {
        return(
            <View style={{borderTopWidth: 1, borderColor: '#f4f7f8', height: 50, alignItems: 'center', paddingHorizontal: 20}}>
                {this.props.renderContent}
            </View>
        )
    }
}

export default AddWordScreen;
