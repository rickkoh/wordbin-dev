import React from 'react';
import { Text, View, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { Icon } from 'react-native-elements';

import { headerStyles, colors } from '../Styles';

import Header from '../components/Header';
import WordBrowser from '../components/WordBrowser';
import AddActionButton from '../components/AddActionButton';
import database from '../services/Database';

export default class HomeScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            title: 'Home'
        }

        console.disableYellowBox = true;
    }

    componentWillMount() {
        DeviceEventEmitter.addListener("database_changed", () => this.refreshData());
        DeviceEventEmitter.addListener("change_title", (title) => this.setState({title: title}));
    }

    componentDidMount() {
        this.refreshData();
    }

    refreshData = () => {
        console.log('data refreshed');
        this.loadData((data) => this.setState(data));
    }

    loadData = (callback) => {

        entire_database = {};

        loadWords = () => {
            database.getWords(
                (error) => console.log(error),
                (data) => { 
                    entire_database.Words = data;
                    loaded();
                }
            );

            function loaded() {
                loadMeanings();
            }

            function failed() {

            }
        }

        loadMeanings = () => {
            if (entire_database.Words.length > 0) {
                entire_database.Words.forEach(async (word, word_index) => {

                    last = false;

                    database.getMeanings(word.word_id,
                        (error) => console.log(error),
                        (data) => {
                            entire_database.Words[word_index].Meanings = data;
                            loadSynonyms(word_index);
                        }
                    );

                    database.getWordTags(word.word_id,
                        (error) => console.log(error),
                        (data) => {
                            entire_database.Words[word_index].Tags = data;
                        })
                });
            } else {
                complete();
            }
        }

        loadSynonyms = (word_index) => {
            entire_database.Words[word_index].Meanings.forEach(async (meaning, meaning_index) => {
                database.getWordSynonym(meaning.meaning_id,
                    (error) => console.log(error),
                    (data) => {
                        entire_database.Words[word_index].Meanings[meaning_index].Synonyms = data;
                        if (word_index == entire_database.Words.length-1 && meaning_index == entire_database.Words[word_index].Meanings.length-1) complete();
                    }
                )
            })
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

    loadDatas = (callback) => {

        entire_database = {};

        loadWords = () => {
            database.getWords(
                (error) => console.log(error),
                (data) => { 
                    entire_database.Words = data;
                    loadMeanings();
                }
            );
        }

        loadMeanings = () => {
            if (entire_database.Words.length > 0) {
                entire_database.Words.forEach(async (word, word_index) => {
                    database.getMeanings(word.word_id,
                        (error) => console.log(error),
                        (data) => {
                            entire_database.Words[word_index].Meanings = data;
                            loadSynonyms(word_index);
                        }
                    );

                    database.getWordTags(word.word_id,
                        (error) => console.log(error),
                        (data) => {
                            entire_database.Words[word_index].Tags = data;
                        })
                });
            } else {
                complete();
            }
        }

        loadSynonyms = (word_index) => {
            entire_database.Words[word_index].Meanings.forEach(async (meaning, meaning_index) => {
                database.getWordSynonym(meaning.meaning_id,
                    (error) => console.log(error),
                    (data) => {
                        entire_database.Words[word_index].Meanings[meaning_index].Synonyms = data;
                        if (word_index == entire_database.Words.length-1 && meaning_index == entire_database.Words[word_index].Meanings.length-1) complete();
                    }
                )
            })
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

    test = () => {
        console.log(this.state);
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
                            {this.state.title}
                        </Text>
                    }
                    headerRight={
                        <TouchableOpacity
                            onPress={this.test}
                            style={headerStyles.headerButtonRight}>
                            <Icon name='grid' type="entypo" color={colors.default.primaryColor}/>
                        </TouchableOpacity>
                    }
                />
                <WordBrowser
                    onCardPress={() => this.props.navigation.navigate('AddWord')}
                    data={this.state.Words}
                />
                <AddActionButton
                    onPress={() => this.props.navigation.navigate('AddWord')}
                />
            </View>
        )

    };
}