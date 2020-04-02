import React from 'react';
import { DeviceEventEmitter, ScrollView, FlatList, NetInfo, KeyboardAvoidingView, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import Modal from 'react-native-modal';

import { colors, headerStyles, SCREEN_HEIGHT, SCREEN_WIDTH } from '../Styles';

import Header from '../components/Header';
import PillButton from '../components/Buttons/PillButton';
import WordInput from '../components/Forms/WordInput';
import PronunciationInput from '../components/Forms/PronunciationInput';
import MeaningForm from '../components/Forms/MeaningForm';
import TagForm from '../components/Forms/TagForm';

import MeaningFormModal from '../components/Forms/MeaningFormModal';

import database from '../services/Database';

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
            meaningsentence: [
                {
                    meaningsentence_id: undefined,
                    meaningsentence_meaning_id: undefined,
                    meaningsentence_text: undefined,
                    meaningsentence_datetimecreated: undefined,
                }
            ],
            tags: [
                // {
                    // tag_title: undefined,
                // }
            ],
            apiWord: {
                word_text: "",
            },
            meaningCurrentIndex: 0,
            keyboardBarType: undefined,
            wordIsValidated: false,
            wordHasAPIdata: false,
            datetimeadded: undefined,
            isValidated: false,
        }
    }

    // Function executes everytime the page is updated
    // Perform validation
    componentDidUpdate(prevProps, prevState) {
        // Validate Word
        if (this.state.word.word_text != undefined && this.state.word.word_text != "" && this.state.word.word_text.length <= 64) {
            if (prevState.isValidated != true) this.setState({ isValidated: true });
        } else {
            if (prevState.isValidated != false) this.setState({ isValidated: false });
        }
    }

    // Focus on the caret on the word input when page is loaded
    componentDidMount() {
        this.wordInput.focus();
    }

    // Notify listeners
    componentWillUnmount() {
        DeviceEventEmitter.emit("database_changed");
    }

    // Handle meaning sentence example change
    handleMeaningSentenceExampleChange = (text , index) => {
        meaning = this.state.meaning;
        meaning[index].sentenceexample
    }

    // Remove meaning
    removeMeaning = () => {
        meaning = this.state.meaning;
        meaning.splice(this.state.meaningCurrentIndex, 1);
        this.setState({ meaning: meaning });
    }

    // Handle origin change
    handleOriginChange = (text) => {
        this.state.word.word_origin = text;
        this.setState({ word: this.state.word });
    }

    // Toggle 
    toggleMeaningModalVisibility = () => {
        // Toggle Modal Visibility
        // True to display, vice versa
        console.log('toggling');
        this.setState(prevState => ({isMeaningModalVisible: !prevState.isMeaningModalVisible}))
    }

    toggleAPIModalVisibility = () => {
        this.setState(prevState => ({isAPIModalVisible: !prevState.isAPIModalVisible}))
    }

    meaningCurrentIndexChanged = (index) => {
        this.setState({meaningCurrentIndex: index})
    }

    apiButtonPressed = () => {
        // Fetch data when api button is pressed
        NetInfo.getConnectionInfo().then((connectionInfo) => {
            if (connectionInfo.type != 'none') {
                // Replace spaces with dashes
                word = this.state.word.word_text.split(" ").join("-");
                console.log(word);
                fetch('https://googledictionaryapi.eu-gb.mybluemix.net/?define='+word).then((response) => 
                    // Jsonify Data
                    response.json()
                )
                .then((responseJson) => {
                    // Handle Data
                    this.openAPIModal(responseJson);
                }).catch((error) => {
                    // Handle Fail
                    console.log(error);
                })
            }
        });
    }

    // Opens up the API modal
    openAPIModal = (responseJson) => {
        this.toggleAPIModalVisibility();
        // Convert responseJson to word object
        // Use word card to display

        // Create objects
        Word = {};
        Meaning = [];
        
        console.log(responseJson);

        // Convert responseJson to objects
        responseJson.forEach((word) => {
            // Retrieve word_text
            Word.word_text = word["word"];
            Word.word_pronunciation = word["phonetic"];
            Word.word_origin = word["origin"];

            // Retrieve meaning
            for (var classification in word["meaning"]) {
                word["meaning"][classification].forEach((meaning) => {
                    Meaning.push({meaning_text: meaning["definition"], meaning_classification: classification})
                })
            }
        });
        // Objects obtained
        this.setState({
            apiWord: Word,
            apiMeaning: Meaning
        });
        console.log(this.state.apiWord);
    }

    // Handle clear button pressed
    clearButtonPressed = () => {
        // Get the current keyboard state
        // Remove state.item based on current keyboard state
        console.log(this.state.keyboardBarType);
        if (this.state.keyboardBarType == "word") this.setState((prevState) => ({word: { ...prevState.word, word_text: undefined}}))
        else if (this.state.keyboardBarType == "pronunciation") this.setState((prevState) => ({word: { ...prevState.word, word_pronunciation: undefined}}))
        else if (this.state.keyboardBarType == "meaning") {
            if (this.state.meaningCurrentIndex == this.state.meaning.length-1) {
                meaning = this.state.meaning;
                meaning[this.state.meaningCurrentIndex].meaning_text = undefined;
                this.setState({ meaning: meaning });
            } else {
                this.removeMeaning();
            }
        } 
        else if (this.state.keyboardBarType == "classification") {
            meaning = this.state.meaning;
            meaning[this.state.meaningCurrentIndex].meaning_classification = undefined;
            this.setState({ meaning: meaning });
        }
    }

    // Handle add button pressed
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
                await database.getTag(tag.tag_title).then(async data => {
                    // Tag already exist, just link the tag
                    if (data.length > 0) {
                        await database.addWordTag(word_id, data[0].tag_id)
                        .catch(error => console.log(error))
                    }
                    // Tag doesn't exist, create tag first then link the tag
                    else {
                        await database.addTag(tag).then(async tag_id => {
                            await database.addWordTag(word_id, tag_id)
                            .catch((error) => console.log(error));
                        })
                        .catch((error) => console.log(error))
                    }
                }).catch(error => console.log(error))
            })
        })
        .catch((error) => console.log(error))
        .then(() => this.props.navigation.goBack())

    }

    test = () => {
        console.log(this.state);
        this.setState({isMeaningModalVisible: true})
        // this.insertAPIDataButtonPressed();
    }

    insertAPIDataButtonPressed = () => {
        Word = this.state.apiWord;
        Word.word_text = this.state.word.word_text;
        Meaning = this.state.apiMeaning;
        this.setState({
            word: Word,
            meaning: Meaning,
            isAPIModalVisible: false
        }, () => {
            this.meaningForm.updateData();
        });
    }

    // TODO: Clean this chunk of code
    renderKeyboardBar = () => {
        return(
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    {
                        // API Button
                        // Retrieve api data when button is pressed
                    }
                    <TouchableOpacity onPress={this.apiButtonPressed}>
                        <Icon name='google' type='antdesign' color={colors.default.blue} opacity={this.state.wordHasAPIdata ? 1 : 1}/>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                    {
                        // Clear button how am I going to deal with it
                    }
                    <TouchableOpacity style={{marginRight: 15}}
                        onPress={() => this.clearButtonPressed()}
                    >
                        <Text style={{fontSize: 16, color: colors.default.blue}}>Clear</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                    <TouchableOpacity onPress={() => {this.meaningForm.scrollToIndex(this.state.meaningCurrentIndex - 1)}}>
                        <Icon name='chevron-left' color={colors.default.blue} size={22} opacity={1}/>
                    </TouchableOpacity>
                    <Text style={{fontSize: 16, color: colors.default.blue}}>{this.state.meaningCurrentIndex + 1}/{this.state.meaning.length}</Text>
                    <TouchableOpacity onPress={() => {this.meaningForm.scrollToIndex(this.state.meaningCurrentIndex + 1)}}>
                        <Icon name='chevron-right' color={colors.default.blue} size={22} opacity={1}/>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <TouchableOpacity onPress={() => this.test()}>
                        <Icon name='add' color={colors.default.blue}/>
                    </TouchableOpacity>
                </View>
            </View>)
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.keyboardContainer} behavior="padding" enabled>
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
                <View style={styles.formContainer}>
                    <WordInput
                        ref={(ref) => { this.wordInput = ref }}
                        value={this.state.word.word_text}
                        onChangeText={(text) => this.setState((prevState) => ({word: { ...prevState.word, word_text: text}}))}
                        onFocus={() => this.setState({keyboardBarType: 'word'})}
                    />
                    <PronunciationInput
                        value={this.state.word.word_pronunciation}
                        onChangeText={(text) => this.setState((prevState) => ({word: { ...prevState.word, word_pronunciation: text}}))}
                        onFocus={() => this.setState({keyboardBarType: 'pronunciation'})}
                    />
                    <MeaningForm
                        autofocus
                        ref={(ref) => { this.meaningForm = ref }}
                        data={this.state.meaning}
                        onMeaningDataChange={(meaning) => this.setState({meaning: meaning})}
                        onMeaningIndexChange={(index) => this.meaningCurrentIndexChanged(index)}
                        onMeaningTextFocus={() => this.setState({keyboardBarType: 'meaning'})}
                        onClassificationTextFocus={() => this.setState({keyboardBarType: 'classification'})}
                        toggleVisibility={this.toggleMeaningModalVisibility}
                    />
                    <TagForm
                        data={this.state.tags}
                        onTagDataChange={(tags) => this.setState({tags: tags})}
                        onFocus={() => this.setState({keyboardBarType: 'tag'})}
                    />
                </View>
                <KeyboardBar
                    renderContent={this.renderKeyboardBar()}
                    enabled={this.state.isValidated}
                />
                <MeaningFormModal
                    meaning={this.state.meaning[this.state.meaningCurrentIndex]}
                    keyboardBar={this.renderKeyboardBar()}
                    toggleVisibility={this.toggleMeaningModalVisibility}
                    isVisible={this.state.isMeaningModalVisible}
                />
                <Modal
                    onSwipeComplete={this.toggleAPIModalVisibility}
                    isVisible={this.state.isAPIModalVisible}
                    onBackdropPress={() => {
                        this.setState(prevState => ({
                            isAPIModalVisible: false,
                        }
                        ))
                    }}
                    style={{justifyContent: 'flex-end', margin: 0}}
                >
                    <View style={{backgroundColor: colors.default.white, borderTopStartRadius: 20, borderTopEndRadius: 20, padding: 20, paddingTop: 0, height: SCREEN_HEIGHT*0.80}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Text style={{fontSize: 30, maxWidth: SCREEN_WIDTH-105}} numberOfLines={1}>{this.state.word.word_text}</Text>
                            <TouchableOpacity style={{marginLeft: 10, marginRight: 5, paddingVertical: 5}} onPress={this.insertAPIDataButtonPressed}>
                                <Icon name="arrow-up" type="material-community" size="20" color={colors.default.blue} reverse></Icon>
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            <Text>{this.state.word.word_text}</Text>
                            <Text style={{marginBottom: 5}}>{this.state.apiWord !== 'undefeinfed' ? this.state.apiWord.word_pronunciation : ""}</Text>
                            <FlatList
                                data={this.state.apiMeaning}
                                renderItem={this.renderMeaning}
                                keyExtractor={(item, index) => index.toString()}
                                listKey={(item, index) => index.toString()}
                            />
                        </ScrollView>
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        )
    }

    renderMeaning = ({item, index}) => {
        synonym = [{text: "Synonyms:"}]
        return(
            <View style={{flexDirection: 'row', marginBottom: 5}}>
                <View style={{marginRight: 60}}>
                    {item.meaning_classification == undefined ? null : (
                        <Text style={{fontSize: 12, marginBottom: 5, color: 'gray'}}>{item.meaning_classification}</Text>
                    )}
                    <Text style={{fontSize: 14, marginBottom: 7.5}}>{item.meaning_text}</Text>
                </View>
                <View style={{backgroundColor: 'pink'}}>

                </View>
            </View>
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

const styles = StyleSheet.create({
    keyboardContainer: {
        flex: 1,
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: 20,
    }
})

export default AddWordScreen;