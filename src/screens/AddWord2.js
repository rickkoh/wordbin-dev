import React from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, View, Button, Alert, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import { Icon } from 'react-native-elements';
import Modal from 'react-native-modalbox';
import { SQLite } from 'expo-sqlite';

import { colors, headerStyles, buttonStyles } from '../Styles';
import Header from '../components/Header';

const timer = require('react-native-timer');
const db = SQLite.openDatabase('db.db');

const colors = {
    default: {
        backgroundColor: 'white',
        primaryColor: 'black',
        secondaryColor: 'darkgray',
        tertiaryColor: 'lightgray',
        blue: '#1183db',
        red: '#db3236'
    },
}

class AddWordScreen extends React.Component {

    // This class mainly manages the state of the word being created

    // Constructor
    constructor(props){
        super(props);

        this.state = {
            word: [
                {
                    word_text: undefined,
                    meaning: [],
                    Tag: undefined,
                    word_id: undefined,
                }
            ],
            AddButtonDisabledStatus: true,
            renderValidation: false,
            isValidated: true,
            myword: {
                word: undefined,
                type: undefined,
                meaning: undefined,
                datetimeadded: undefined,
            }
        }

        // Validated is when all the terms have been validated
        //
        this.appendMeaning(this.state.word[0]);

        // State
        // word
        // isValidated
        //
        // Props
    }

    // Component did mount
    componentDidMount() {
        //this.props.navigation.setParams({ addWord: this.addWord });
        this.wordInput.focus();
    }

    // Component will unmount
    componentWillUnmount() {
        // Implement cancel fetch
        // Call cancel
        console.log("unmounting");
        //timer.clearTimeout(this, 'fetchWordAPI');
    }

    // Append meaning
    appendMeaning = (item) => {
        // Meaning object
        item.meaning = item.meaning.concat([{ parent: item, expanded: false,  meaning_id: undefined, meaning_text: undefined, meaning_classification: undefined,  example: [], synonym: [] }]);
    }

    // Append example
    appendExample = (item) => {
        // Example object
        item.example = item.example.concat([{ parent: item, example_id: undefined, example_text: undefined }]);
        this.setState({ word: this.state.word });
    }

    // Append synonym
    appendSynonym = (item) => {
        // Synonym object
        item.synonym = item.synonym.concat([{ parent: item, synonym_id: undefined, synonym_text: undefined }]);
        this.setState({ word: this.state.word });
    }

    // Splice meaning
    spliceMeaning = (item, index) => {
        item.meaning.splice(index, 1);
    }

    // Splice example
    spliceExample = (item, index) => {
        item.example.splice(index, 1);
    }

    // Splice synonym
    spliceSynonym = (item, index) => {
        item.synonym.splice(index, 1);
    }

    // Delete example
    deleteExample = (item) => {
        console.log(item);
        if (item.example.length > 2) {
            // Create alert dialog
            Alert.alert(
                "Clear data",
                "Are you sure you want to clear the data",
                [
                    {text: "Yes", onPress: () => {
                        item.example = [];
                        this.setState({ word: this.state.word });
                    }},
                    {text: "Cancel", style: 'cancel'}
                ]
            );
        } else {
            item.example = [];
            this.setState({ word: this.state.word });
        }
    }

    // Handle word change
    handleWordChange = (text) => {
        // How do we handle the validation because we are handling it for multiple fields we want the thing to work on t
        this.state.word[0].word_text = text;
        if (text == undefined || text == "") {
            this.setState({ AddButtonDisabledStatus: true, wordAPI: undefined })
            // Clear timer when text is empty
            timer.clearTimeout(this, 'fetchWordAPI');
        } else {
            this.setState({ AddButtonDisabledStatus: false, renderValidation: false, isValidated: false })
            // Reset timer every text change
            timer.setTimeout(this, 'fetchWordAPI', () => this.fetchWordAPI(text), 1000);
            console.log(this.state.isValidated);
        }
    }

    // Get word data from API
    fetchWordAPI = (text) => {
        console.log("getting "+text+" data from API");
        fetch('https://mydictionaryapi.appspot.com/?define=' + text)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({wordAPI: responseJson})
                console.log(responseJson);
            })
            .catch((error) => {
                this.setState({wordAPI: undefined})
                console.log(error);
            });
    }

    // Handle meaning change
    handleMeaningChange = (text, item) => {

        // Update text
        item.meaning_text = text;
        this.setState({ word: this.state.word });

        // Handle additional examples
        item.parent.meaning.forEach((item, index) => {
            if (index == item.parent.meaning.length-1) {
                if (item.meaning_text != "" && item.meaning_text != undefined) {
                    this.appendMeaning(item.parent);
                }
            } else {
                if (item.meaning_text == "" || item.meaning_text == undefined) {
                    this.spliceMeaning(item.parent, index);
                }
            }
        })
    }

    // Handle example change
    handleExampleChange = (text, item) => {

        // Update text
        item.example_text = text;
        this.setState({ word: this.state.word });

        // Handle additional examples
        item.parent.example.forEach((item, index) => {
            if (index == item.parent.example.length-1) {
                if (item.example_text != "" && item.example_text != undefined) {
                    this.appendExample(item.parent);
                }
            } else {
                if (item.example_text == "" || item.example_text == undefined) {
                    this.spliceExample(item.parent, index);
                }
            }
        });

    }

    // Handle synonym change
    handleSynonymChange = (text, item) => {

        // Update text
        item.synonym_text = text;
        this.setState({ word: this.state.word });

        // Handle additional synonyms
        item.parent.synonym.forEach((item, index) => {
            if (index == item.parent.synonym.length-1) {
                if (item.synonym_text != "" && item.synonym_text != undefined) {
                    this.appendSynonym(item.parent);
                }
            } else {
                if (item.synonym_text == "" || item.synonym_text == undefined) {
                    this.spliceSynonym(item.parent, index);
                }
            }
        });

    }

    // Handle tag change
    handleTagChange = (text) => {
        this.state.word[0].Tag = text;
        this.setState({ word: this.state.word });
    }

    // Handle classification change
    handleClassificationChange = (value, item) => {
        console.log(item.meaning_classification);
        console.log(value);
        item.meaning_classification = value;
        this.setState({ word: this.state.word })
    }

    // Add word to the database
    addWord = () => {
        if (!this.state.AddButtonDisabledStatus) {

            // Insert word to database
            this.state.word.forEach(async (item, index) => {
                db.transaction(tx => {
                    tx.executeSql(
                        'INSERT INTO word (word_text, word_datetimecreated) VALUES (?, date("now"));',
                        [item.word_text],
                        (_, { insertId }) => item.word_id = insertId
                    );
                }, err => {
                    console.log(err);
                }, success => {
                    // Insert meaning to database
                    if (item.meaning.length > 0) {
                        item.meaning.forEach(async (item, index) => {
                            if (index != item.parent.meaning.length-1) {
                                db.transaction(tx => {
                                    // Need some code cleaning here
                                    if (item.meaning_classification == "" || item.meaning_classification == undefined) {
                                        console.log(item.meaning_classification + " test test test");
                                        tx.executeSql(
                                            'INSERT INTO meaning (word_id, meaning_text, meaning_datetimecreated) VALUES (?, ?, date("now"));',
                                            [item.parent.word_id, item.meaning_text],
                                            (_, { insertId }) => item.meaning_id = insertId
                                        );
                                    } else {
                                        tx.executeSql(
                                            'INSERT INTO meaning (word_id, meaning_text, meaning_classification, meaning_datetimecreated) VALUES (?, ?, ?, date("now"));',
                                            [item.parent.word_id, item.meaning_text, item.meaning_classification],
                                            (_, { insertId }) => item.meaning_id = insertId
                                        );
                                    }
                                }, err => {
                                    console.log(err);
                                }, success => {
                                    // Insert example to database
                                    if (item.example.length > 0) {
                                        item.example.forEach(async (item, index) => {
                                            if (index != item.parent.example.length-1) {
                                                db.transaction(tx => {
                                                    tx.executeSql(
                                                        'INSERT INTO example (meaning_id, example_text, example_datetimecreated) VALUES (?, ?, date("now"));',
                                                        [item.parent.meaning_id, item.example_text]
                                                    )
                                                }, err => {
                                                    console.log(err);
                                                }, success => {
                                                    console.log("successfully added word");
                                                })
                                            }
                                        })
                                    }
                                    // Insert synonym to database
                                    if (item.synonym.length > 0) {
                                        item.synonym.forEach(async (item, index) => {
                                            if (index != item.parent.synonym.length-1) {
                                                db.transaction(tx => {
                                                    tx.executeSql(
                                                        'INSERT INTO synonym (meaning_id, synonym_text, synonym_datetimecreated) VALUES (?, ?, date("now"));',
                                                        [item.parent.meaning_id, item.synonym_text]
                                                    )
                                                }, err => {
                                                    console.log(err);
                                                }, success => {
                                                    console.log("successfully added word");
                                                })
                                            }
                                        })
                                    }
                                });
                            }
                        });
                    }
                });
            });

            // Update the homepage
            this.props.navigation.state.params.updateDatabase();

            // Navigate back
            this.props.navigation.navigate('Home');

        } else {

            this.renderValidation();

        }
    }

    // Add meaning to the database
    addMeaning = () => {

    }

    // Add example to the database
    addExample = () => {

    }

    // Render validation
    renderValidation = () => {
        this.setState({renderValidation: true});
    }

    // Render word text input
    renderWordTextInput = (item) => {

        wordTextInput = (renderValidation) => {
            if (renderValidation) {
                return {
                    flex: 1,
                    fontSize: 16,
                    height: 40,
                    borderBottomWidth: 3,
                    borderColor: colors.default.red,
                }
            } else {
                return {
                    flex: 1,
                    fontSize: 16,
                    height: 40,
                    borderBottomWidth: 3,
                    borderColor: colors.default.backgroundColor,
                }
            }
        }

        renderWordAPIButton = (item) => {
            if (item == undefined) {
                return(
                    <View></View>
                )
            } else {
                return(
                    <View>
                        <TouchableOpacity
                            onPress={ () => { this.refs.modal3.open(), this.renderAPIDataModal()} }
                            style={styles.addExampleButton}>
                            <Icon name='get-app' color={colors.default.secondaryColor}/>
                        </TouchableOpacity>
                    </View>
                )
            }
        }

        return(
            <View style={styles.containerRow}>
                <TextInput
                    ref={(input) => { this.wordInput = input; }}
                    style={wordTextInput(this.state.renderValidation)}
                    value={item.word_text}
                    placeholder="Word"
                    autoCorrect={false}
                    onChangeText={(text) => this.handleWordChange(text)}
                />
                { renderWordAPIButton(this.state.wordAPI) }
            </View>
        )
    }

    renderAPIDataModal = () => {
        if (this.state.wordAPI != undefined && this.state.wordAPI.length > 0) {
            return (
                <View>
                    <Text>{ this.state.wordAPI[0].word }</Text>
                    <Text>{ this.state.wordAPI[0].phonetic }</Text>
                    <Text>{ this.state.wordAPI[0].origin }</Text>
                </View>
            )
        }
    }

    // Render classification picker
    renderClassificationPicker = (item) => {
        let classifications = [
            {
                value: undefined
            },
            {
                value: 'Noun'
            },
            {
                value: 'Pronoun'
            },
            {
                value: 'Adjective'
            },
            {
                value: 'Verb'
            },
            {
                value: 'Adverb'
            },
            {
                value: 'Proposition'
            },
            {
                value: 'Conjunction'
            },
            {
                value: 'Interjection'
            },
            {
                value: 'Article'
            },
        ];

        return (
            <Dropdown
                label='Classification'
                itemCount={6}
                data={classifications}
                value={item.meaning_classification}
                onChangeText={(value) => this.handleClassificationChange(value, item)}
            />
        )
    }

    // Render meaning list
    renderMeaningList(item) {
        return(
            <View style={styles.containerFlatList}>
                <FlatList
                    ref={ref => this.meaningList = ref}
                    onContentSizeChange={() => this.meaningList.scrollToEnd({animated: true})}
                    data={item.meaning}
                    renderItem={({item, index}) => this.renderMeaningTextInput(item)}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        )
    }

    // Render meaning text input
    renderMeaningTextInput = (item) => {

        renderClearButton = (item) => {
            if (item.meaning_text != undefined && item.meaning_text != "") {
                return(
                    <TouchableOpacity
                        onPress={() => this.handleMeaningChange("", item)}
                        style={styles.clearButton}>
                        <Icon name='cancel' size={16} color={colors.default.secondaryColor}/>
                    </TouchableOpacity>
                )
            }
        }

        return(
            <View>
                <View style={styles.containerMeaning}>
                    <TextInput
                        style={styles.meaningTextInput}
                        value={item.meaning_text}
                        placeholder="Meaning"
                        onChangeText={(text) => this.handleMeaningChange(text, item)}
                    />
                    { renderClearButton(item) }
                    { this.renderMeaningExpandButton(item) }
                </View>
                { this.renderMeaningAdvancedMenu(item) }
            </View>
        )
    }

    // Render meaning advanced menu
    renderMeaningAdvancedMenu = (item) => {
        if (item.expanded) {
            return (
                <View>
                    { this.renderClassificationPicker(item) }
                    { this.renderSynonymList(item) }
                    { this.renderExampleList(item) }
                </View>
            )
        } else {
            return (
                <View></View>
            )
        }
    }

    // Render example button
    renderMeaningExpandButton = (item) => {
        if (!item.expanded && item.example.length == 0) {
            return(
                <TouchableOpacity
                    onPress={() => { this.appendExample(item), this.appendSynonym(item), this.expandMeaningAdvancedMenu(item) }}
                    style={styles.addExampleButton}>
                    <Icon name='expand-more' color={colors.default.secondaryColor}/>
                </TouchableOpacity>
            )

        } else if (!item.expanded) {
            return(
                <View style={styles.containerRow}>
                    <TouchableOpacity
                        onPress={() => this.deleteExample(item)}
                        style={styles.addExampleButton}>
                        <Icon name='close' color={colors.default.secondaryColor}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.expandMeaningAdvancedMenu(item)}
                        style={styles.addExampleButton}>
                        <Icon name='expand-more' color={colors.default.secondaryColor}/>
                    </TouchableOpacity>
                </View>
            )
        } else {
            return(
                <View style={styles.containerRow}>
                    <TouchableOpacity
                        onPress={() => { this.collapseMeaningAdvancedMenu(item), this.deleteExample(item) }}
                        style={styles.addExampleButton}>
                        <Icon name='close' color={colors.default.secondaryColor}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.collapseMeaningAdvancedMenu(item)}
                        style={styles.addExampleButton}>
                        <Icon name='expand-less' color={colors.default.secondaryColor}/>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    // Expand advanced meaning
    expandMeaningAdvancedMenu = (item) => {
        item.expanded = true;
        this.setState({ word: this.state.word });
    }

    // Collapse advanced meaning
    collapseMeaningAdvancedMenu = (item) => {
        item.expanded = false;
        this.setState({ word: this.state.word });
    }

    // Render example list
    renderExampleList = (item) => {
        return(
            <View>
                <FlatList
                    ref={ref => this.exampleList = ref}
                    onContentSizeChange={() => this.exampleList.scrollToEnd({animated: true})}
                    data = {item.example}
                    renderItem={({item, index}) => this.renderExampleTextInput(item, index)}
                    keyExtractor={(item, index) => index.toString()}
                    listKey={(item, index) => index.toString()}
                />
            </View>

        )
    }

    // Render synonym list
    renderSynonymList = (item) => {
        return(
            <View>
                <FlatList
                    ref={ref => this.synonymList = ref}
                    onContentSizeChange={() => this.synonymList.scrollToEnd({animated: true})}
                    data = {item.synonym}
                    renderItem={({item, index}) => this.renderSynonymTextInput(item, index)}
                    keyExtractor={(item, index) => index.toString()}
                    listKey={(item, index) => index.toString()}
                />
            </View>

        )
    }

    // Render example text input
    renderExampleTextInput = (item, index) => {

        boldedIndex = () => {
            if (item.example_text != undefined && item.example_text != "") {
                return (index+1) + ". ";
            }
        }

        return(
            <View style={styles.containerExample}>
                <TextInput
                    value={boldedIndex()}
                    placeholder={index+1 + ". "}
                    editable={false}
                />
                <TextInput
                    style={styles.exampleTextInput}
                    value={item.example_text}
                    placeholder="Example"
                    onChangeText={(text) => this.handleExampleChange(text, item)}
                />
            </View>
        )
    }

    // Render synonym text input
    renderSynonymTextInput = (item, index) => {

        boldedIndex = () => {
            if (item.synonym_text != undefined && item.synonym_text != "") {
                return (index+1) + ". ";
            }
        }

        return(
            <View style={styles.containerSynonym}>
                <TextInput
                    value={boldedIndex()}
                    placeholder={index+1 + ". "}
                    editable={false}
                />
                <TextInput
                    style={styles.synonymTextInput}
                    value={item.synonym_text}
                    placeholder="Synonym"
                    onChangeText={(text) => this.handleSynonymChange(text, item)}
                />
            </View>
        )
    }

    // Render tag text input
    renderTagTextInput = (item) => {
        return(
            <TextInput
                style={styles.tagsTextInput}
                value={item.Tag}
                placeholder="Tags"
                onChangeText={this.handleTagChange}
            />
        )
    }

    // Render tag suggestion list
    renderTagSuggestionList = () => {

    }

    // Render add button
    renderAddButton = () => {

        addWordButton = function(disabled, renderValidation){
            if (disabled && renderValidation) {
                return {
                    padding: 15,
                    borderRadius: 5,
                    alignItems: 'center',
                    backgroundColor: colors.default.red,
                }
            } else {
                return {
                    padding: 15,
                    borderRadius: 5,
                    alignItems: 'center',
                    backgroundColor: colors.default.blue,
                }
            }
        }

        return(
            <View style={styles.containerButton}>
                <TouchableOpacity
                    onPress={this.addWord}
                    style={addWordButton(this.state.AddButtonDisabledStatus, this.state.renderValidation)}>
                    <Text style={{color: "white"}}>Add</Text>
                </TouchableOpacity>
            </View>
        )
    }

    // Render header
    renderHeader = () => {

        return (
            <Header
                headerRight={
                    <AddButton
                        enabled={this.state.isValidated}
                    />
                }
                headerTitle={
                    <Text style={headerStyles.headerTitle}>{this.state.word[0].word_text}</Text>
                }
                headerLeft={
                    <TouchableOpacity
                        onPress={() => this.props.navigation.goBack()}
                        style={headerStyles.headerButtonLeft}>
                        <Text numberOfLines={1} style={{color: colors.default.blue, fontSize: 16}}>Cancel</Text>
                    </TouchableOpacity>
                }
            />
        )
    }

    // Render
    render() {
        console.log('render()');
        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
                { this.renderHeader() }
                <View style={styles.container}>
                    <ScrollView>
                        <View style={styles.containerBody}>
                            { this.renderWordTextInput(this.state.word[0]) }
                            { this.renderTagTextInput(this.state.word[0]) }
                        </View>
                    </ScrollView>
                { this.renderAddButton() }

                <Modal style={{ justifyContent: "center", alignItems: "center", height: 300, width: 300, backgroundColor: colors.default.backgroundColor }} position={"center"} ref={"modal3"} isDisabled={this.state.isDisabled}>
                    { this.renderAPIDataModal() }
                </Modal>

                </View>
            </KeyboardAvoidingView>
        )
    }
}

class ScreenContainer extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {
        <Header />
    }

}

class AddWordHeader extends React.Component {
    constructor(props){
        super(props);
    }

    render() {

    }
}

class BodyContainer extends React.Component {

}

class WordContainer extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {

    }

}

class MeaningContainer extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {

    }

}

class TagContainer extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {

    }

}

class AddButton extends React.Component {

    constructor(props){
        super(props);
    }

    addButtonStyle = function(enabled){
        if (enabled) {
            return {
                backgroundColor: colors.default.blue,
                borderColor: colors.default.blue,
                borderRadius: 25,
                paddingHorizontal: 15,
                paddingVertical: 3,
                marginRight: 22.5,
                opacity: 1,
            }
        } else {
            return {
                backgroundColor: colors.default.blue,
                borderColor: colors.default.blue,
                borderRadius: 25,
                paddingHorizontal: 15,
                paddingVertical: 3,
                marginRight: 22.5,
                opacity: 0.25,
            }
        }
    }

    // Render the add button
    render() {
        console.log("test" + this.props.enabled);
        return(
            <TouchableOpacity
                onPress={this.addWord}
                style={headerStyles.headerButtonRight, this.addButtonStyle(this.props.enabled)}>
                <Text numberOfLines={1} style={{color: 'white', fontSize: 16}}>Add</Text>
            </TouchableOpacity>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerRow: {
        flexDirection: 'row',
    },
    containerBody: {
      paddingTop: 10,
      paddingHorizontal: 20,
      backgroundColor: colors.default.backgroundColor,
      alignItems: 'stretch',
    },
    containerMeaning: {
        flexDirection: 'row',
        height: 40,
    },
    containerExample: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
        height: 40,
    },
    containerSynonym: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
        height: 40,
    },
    containerButton: {
      justifyContent: 'flex-end',
    },
    containerFlatList: {
        maxHeight: 200,
    },
    wordTextInput: {
        height: 40,
    },
    meaningTextInput: {
        flex: 1,
    },
    exampleTextInput: {
        flex: 1,
    },
    synonymTextInput: {
        flex: 1,
    },
    tagsTextInput: {
        flex: 1,
        height: 40,
    },
    addExampleButton:{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    clearButton:{
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    iconTest: {
        transform: [{ rotate: '90deg'}]
    },
    headerButtonRight:{
        paddingRight: 20,
        alignItems: 'center',
    },
});

export default AddWordScreen;
