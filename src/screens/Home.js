import React from 'react';
import { Text, TextInput, View, TouchableOpacity, FlatList, DeviceEventEmitter, ListView } from 'react-native';
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
        }
        console.disableYellowBox = true;

    }

    componentWillMount() {
        DeviceEventEmitter.addListener("database_changed", () => this.refreshData());
    }

    componentDidMount() {
        this.refreshData();
    }

    refreshData = () => {
        this.loadData((data) => this.setState(data));
    }

    loadData = (callback) => {

        entire_database = {};

        loadWords = () => {
            try {
                database.getWords(
                    (errorMessage) => console.log(errorMessage),
                    (data) => { 
                        entire_database.Words = data;
                        loadMeanings();
                    }
                );
            } catch {
                console.log("error");
            }
        }

        loadMeanings = () => {
            try {
                entire_database.Words.forEach(async (word, word_index) => {
                    database.getMeanings(word.word_id,
                        (errorMessage) => console.log(errorMessage),
                        (data) => {
                            entire_database.Words[word_index].Meanings = data;
                            loadSynonyms(word_index);
                        }
                    );

                    database.getWordTags(word.word_id,
                        (errorMessage) => console.log(errorMessage),
                        (data) => {
                            entire_database.Words[word_index].Tags = data;
                        })
                });
            } catch {
                console.log("error");
            }
        }

        loadSynonyms = (word_index) => {
            try {
                entire_database.Words[word_index].Meanings.forEach(async (meaning, meaning_index) => {
                    database.getWordSynonym(meaning.meaning_id,
                        (errorMessage) => console.log(errorMessage),
                        (data) => {
                            entire_database.Words[word_index].Meanings[meaning_index].Synonyms = data;
                            if (word_index == entire_database.Words.length-1 && meaning_index == entire_database.Words[word_index].Meanings.length-1) complete();
                        }
                    )
                })
            } catch {
                console.log("error");
            }
        }

        complete = () => {
            try {
                callback(entire_database);
            } catch (error) {
                console.log(error);
            }
        }

        loadWords();
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
                            onPress={() => console.log(this.state)}
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