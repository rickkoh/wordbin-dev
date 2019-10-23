import React from 'react';
import { DeviceEventEmitter, KeyboardAvoidingView, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

import { colors, headerStyles } from '../Styles';

import Header from '../components/Header';
import PillButton from '../components/PillButton';
import WordInput from '../components/Forms/WordInput';
import PronunciationInput from '../components/Forms/PronunciationInput';
import MeaningForm from '../components/Forms/MeaningForm';
import TagForm from '../components/Forms/TagForm';

import database from '../services/Database';

// Search for tags
// If tags already exist
// Link them
// Else
// Create new tags
// And then link them
// Occasionally do some tags merging for example if there are identical tag_titles, merge them together, convert all the wordtags to the first tag id
// Tags are not case sensitive

class AddWordScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            word: {
                word_id: undefined,
                word_text: undefined,
                word_pronunciation: undefined,
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
                    tag_title: undefined,
                }
            ],
            meaningCurrentIndex: undefined,
            keyboardBarType: undefined,
            wordIsValidated: false,
            wordHasAPIdata: false,
            datetimeadded: undefined,
            isValidated: false,
        }
    }

    // Perform validation
    componentDidUpdate(prevProps, prevState) {
        // Validate Word
        if (this.state.word.word_text != undefined && this.state.word.word_text != "" && this.state.word.word_text.length <= 64) {
            if (prevState.isValidated != true) this.setState({ isValidated: true });
        } else {
            if (prevState.isValidated != false) this.setState({ isValidated: false });
        }
    }

    componentDidMount() {
        this.wordInput.focus();
    }

    // Notify listeners
    componentWillUnmount() {
        DeviceEventEmitter.emit("database_changed");
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

    handleClassificationChange = (text, index) => {
        meaning = this.state.meaning;
        meaning[index].meaning_classification = text;
        
        this.setState({ meaning: meaning });
    }

    removeMeaning = () => {
        meaning = this.state.meaning;
        meaning.splice(this.state.meaningCurrentIndex, 1);
        this.setState({ meaning: meaning })
    }

    handleTagChange = (text) => {
        if (text.length > 1 && text[text.length-1] == " "){
            this.addTag();
        } else {
            tags = this.state.tags;
            tags[tags.length-1].tag_title = text;
            this.setState({ tags: tags });
        }
    }

    handleOriginChange = (text) => {
        this.state.word.word_origin = text;
        this.setState({ word: this.state.word });
    }

    addTag = () => {
        tags = this.state.tags;
        text = tags[tags.length-1].tag_title;
        if (text != undefined && text.length>0) {
            tags = tags.concat({tag_title: undefined});
            this.setState({ tags: tags });
        }
    }

    removeTag = (index) => {
        tags = this.state.tags;
        tags.splice(index, 1);
        this.setState({ tags: tags });
    }

    addButtonPressed = () => {

        async function asyncForEach(array, callback) {
            for (let index = 0; index < array.length; index++) {
                await callback(array[index], index, array);
            }
        }

        // Maybe use entities

        Word = this.state.word;
        Meanings = this.state.meaning
        Tag = this.state.tags;

        database.addWord(Word).then(async word_id => {
            await asyncForEach(Meanings, async (meaning) => {
                meaning.meaning_word_id = word_id;
                await database.addMeaning(meaning)
                .catch((error) => console.log(error));
            })

            await asyncForEach(Tag, async (tag) => {
                await database.addTag(tag).then(async tag_id => {
                    await database.addWordTag(word_id, tag_id)
                    .catch((error) => console.log(error));
                })
                .catch((error) => console.log(error))
            })
        })
        .catch((error) => console.log(error))
        .then(() => this.props.navigation.goBack())

    }

    // TODO: Clean this chunk of code
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
                    <TouchableOpacity onPress={() => {this.meaningForm.scrollToIndex(this.state.meaningCurrentIndex - 1)}}>
                        <Icon name='chevron-left' color={colors.default.blue} size={22} opacity={0.25}/>
                    </TouchableOpacity>
                    <Text style={{fontSize: 16, color: colors.default.blue}}>{this.state.meaningCurrentIndex + 1}/{this.state.meaning.length}</Text>
                    <TouchableOpacity onPress={() => {this.meaningForm.scrollToIndex(this.state.meaningCurrentIndex + 1)}}>
                        <Icon name='chevron-right' color={colors.default.blue} size={22} opacity={0.25}/>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <TouchableOpacity onPress={this.addButtonPressed2}>
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
                    onChangeText={(text) => this.setState((prevState) => ({word: { ...prevState.word, word_text: text}}))}
                    onFocus={() => this.setState({keyboardBarType: 'word'})}
                />
                <PronunciationInput
                    value={this.state.word.word_pronunciation}
                    onChangeText={(text) => this.setState((prevState) => ({word: { ...prevState.word, word_pronunciation: text}}))}
                    onFocus={() => this.setState({keyboardBarType: 'word'})}
                />
                <MeaningForm
                    ref={(ref) => { this.meaningForm = ref }}
                    data={this.state.meaning}
                    onMeaningIndexChange={(index) => this.setState({meaningCurrentIndex: index})}
                    onMeaningTextChange={this.handleMeaningChange}
                    onClassificationTextChange={this.handleClassificationChange}
                    onFocus={() => this.setState({keyboardBarType: 'meaning'})}
                />
                <TagForm
                    value={this.state.tags[this.state.tags.length-1].tag_title}
                    data={this.state.tags}
                    onChangeText={this.handleTagChange}
                    onPress={this.removeTag}
                    onFocus={() => this.setState({keyboardBarType: 'tag'})}
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

KeyboardBar = (props) => {
        return(
            <View style={{borderTopWidth: 1, borderColor: '#f4f7f8', height: 50, alignItems: 'center', paddingHorizontal: 20}}>
                {props.renderContent}
            </View>
        )
}

export default AddWordScreen;