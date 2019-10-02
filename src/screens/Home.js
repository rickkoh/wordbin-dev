import React from 'react';
import { Text, View, TouchableOpacity, FlatList, DeviceEventEmitter, ListView } from 'react-native';
import { Icon } from 'react-native-elements';
import { SQLite } from 'expo-sqlite';

import { headerStyles, colors } from '../Styles';
import { SCREEN_WIDTH } from '../Measurements';

import Header from '../components/Header';
import WordBrowser from '../components/WordBrowser';
import AddActionButton from '../components/AddActionButton';
import database from '../services/Database';

const db = SQLite.openDatabase('db.db');

const hapticOptions = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false
};

export default class HomeScreen extends React.Component {

    // Constructor
    constructor(props) {
        super(props);

        this.state = {
            Words: undefined,
        }
        console.disableYellowBox = true;
    }

    // Mount listeners
    componentWillMount() {
        // Apparently this is not working gotta fix this
        // loadwords is executed but data is not refreshed
        DeviceEventEmitter.addListener("word_added", () => this.loadData((data) => this.setState(data)) );
    }

    componentDidMount() {
        // this.loadWords();
        this.loadData((data) => this.setState(data));
    }

    loadData = (callback) => {

        entire_database = {};

        loadWords = () => {
            console.log("Checkpoint loadwords()");
            database.getWords(
                (errorMessage) => console.log(errorMessage),
                (data) => { 
                    entire_database.Words = data;
                    loadMeanings();
                }
            );
        }

        loadMeanings = () => {
            console.log("Checkpoint loadmeanings()");
            entire_database.Words.forEach(async (word, word_index) => {
                database.getMeanings(word.word_id,
                    (errorMessage) => console.log(errorMessage),
                    (data) => {
                        entire_database.Words[word_index].Meanings = data;
                        loadSynonyms(entire_database, word_index);
                    }
                );

                database.getWordTags(word.word_id,
                    (errorMessage) => console.log(errorMessage),
                    (data) => {
                        entire_database.Words[word_index].Tags = data;
                        if (word_index == entire_database.Words.length-1) complete();
                    })
            });
        }

        loadSynonyms = (entire_database, word_index) => {
            console.log("Checkpoint loadsynonyms()");
            entire_database.Words[word_index].Meanings.forEach(async (meaning, meaning_index) => {
                database.getWordSynonym(meaning.meaning_id,
                    (errorMessage) => console.log(errorMessage),
                    (data) => {
                        entire_database.Words[word_index].Meanings[meaning_index].Synonyms = data;
                    }
                )
            })
        }

        complete = () => {
            callback(entire_database);
        }

        loadWords();
    }

    loadWords = () => {
        database.getWords(
            (errorMessage) => console.log(errorMessage),
            (data) => { 
                this.setState({Words: data});
                this.loadMeanings(data);
            }
        );
    }

    loadMeanings = (word_array) => {
        word_array.forEach(async (word, index) => {
            database.getMeanings(word.word_id,
                (errorMessage) => console.log(errorMessage),
                (data) => {
                    this.state.Words[index].Meanings = data;
                    if (index == word_array.length - 1) complete();
                }
            );
        });

        complete = () => {
            this.setState({Words: this.state.Words})
        }
    }

    // Render
    render() {
        console.log("render");
        return (
            <View style={{flex: 1, backgroundColor: colors.default.backgroundColor}}>
                <Header
                    headerLeft={
                        <TouchableOpacity
                            onPress={() => this.props.navigation.openDrawer()}
                            style={headerStyles.headerButtonLeft}>
                            <Icon name='menu' color={colors.default.primaryColor}/>
                        </TouchableOpacity>
                    }
                    headerTitle={
                        <Text style={headerStyles.headerTitle}>
                            Home
                        </Text>
                    }
                    headerRight={
                        <TouchableOpacity
                            onPress={() => this.loadData()}
                            style={headerStyles.headerButtonRight}>
                            <Icon name='grid' type="entypo" color={colors.default.primaryColor}/>
                        </TouchableOpacity>
                    }
                />
                <WordBrowser
                    data={this.state.Words}
                />
                <AddActionButton
                    onPress={() => this.props.navigation.navigate('AddWord', { updateDatabase: this.updateDatabase })}
                />
            </View>
        )

    };
}