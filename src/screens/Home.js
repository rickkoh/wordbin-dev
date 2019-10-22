import React from 'react';
import { Text, View, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { Icon } from 'react-native-elements';

import { headerStyles, colors } from '../Styles';

import Header from '../components/Header';
import WordBrowser from '../components/WordBrowser';
import AddActionButton from '../components/AddActionButton';
import database from '../services/Database';
import PillButton from '../components/PillButton';

export default class HomeScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            title: 'Home',
            Words: [],
            Meanings: [],
            Synonyms: [],
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

    loadData = async (callback) => {

        async function asyncForEach(array, callback) {
            for (let index = 0; index < array.length; index++) {
                await callback(array[index], index, array);
            }
        }

        entire_database = { };

        start = async () => {
            await loadWords().then(async () => {
                await asyncForEach(entire_database.Words, async (word, windex) => {
                    console.log("word index: " + windex);
                    await loadWordTags(word.word_id, windex);
                    await loadMeanings(word.word_id, windex).then(async () => {
                        await asyncForEach(entire_database.Words[windex].Meanings, async (meaning, index) => {
                            console.log(windex);
                            await loadSynonyms(meaning.meaning_id, index, windex);
                        })
                    });
                })
            }).then(() => callback(entire_database));
        }

        loadWords = () => {
            return new Promise((resolve, reject) => {
                database.getWordss()
                .then(data => {
                    entire_database.Words = data;
                    resolve();
                })
            })
        }

        loadWordTags = (word_id, index) => {
            return new Promise((resolve, reject) => {
                database.getWordTags(word_id, null,
                    (data) => {
                        entire_database.Words[index].Tags = data;
                        resolve();
                    }
                );
            })
        }

        loadMeanings = (word_id, index) => {
            return new Promise((resolve, reject) => {
                database.getMeaningss(word_id)
                .then(data => {
                    entire_database.Words[index].Meanings = data;
                    resolve();
                });
            })
        }

        loadSynonyms = (meaning_id, index, windex) => {
            return new Promise((resolve, reject) => {
                database.getWordSynonym(meaning_id, null,
                    (data) => {
                        entire_database.Words[windex].Meanings[index].Synonyms = data;
                        resolve();
                    }
                )
            })
        }

        start();
    }

    loadDatas = async (callback) => {

        // Create an asynchronous for loop function
        async function asyncForEach(array, callback) {
            for (let index = 0; index < array.length; index++) {
                await callback(array[index], index, array);
            }
        }

        entire_database = {
            Words: [],
            Meanings: [],
            Synonyms: [],
            Tags: [],
        };

        start = async () => {
            await loadWords().then(async () => {
                await asyncForEach(entire_database.Words, async (word) => {
                    await loadWordTags(word.word_id);
                    await loadMeanings(word.word_id).then(async () => {
                        await asyncForEach(entire_database.Meanings, async (meaning) => {
                            await loadSynonyms(meaning.meaning_id);
                        })
                    });
                })
            }).then(() => console.log(entire_database));
        }

        loadWords = () => {
            return new Promise((resolve, reject) => {
                database.getWordss()
                .then(data => {
                    entire_database.Words = data;
                    resolve();
                })
            })
        }

        loadWordTags = (word_id) => {
            return new Promise((resolve, reject) => {
                database.getWordTags(word_id, null,
                    (data) => {
                        entire_database.Tags = entire_database.Tags.concat(data);
                        resolve();
                    }
                );
            })
        }

        loadMeanings = (word_id) => {
            return new Promise((resolve, reject) => {
                database.getMeaningss(word_id)
                .then(data => {
                    entire_database.Meanings = entire_database.Meanings.concat(data);
                    resolve();
                });
            })
        }

        loadSynonyms = (meaning_id) => {
            return new Promise((resolve, reject) => {
                database.getWordSynonym(meaning_id, null,
                    (data) => {
                        entire_database.Synonyms = entire_database.Synonyms.concat(data);
                        resolve();
                    }
                )
            })
        }

        fianlFunc = (data) => {
            console.log(data)
        }

        start();
    }

    test = () => {
        this.loadDatas((data) => console.log(data));
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
                {this.state.Words == undefined || this.state.Words.length <= 0 ?
                (<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity
                        text="Add Your First Word"
                        onPress={() => this.props.navigation.navigate('AddWord')}
                    >
                        <Text style={{color: colors.default.blue, fontSize: 16, marginBottom: 100}}>Add Your First Word</Text>
                    </TouchableOpacity>
                </View>) :
                (<WordBrowser
                    onCardPress={() => this.props.navigation.navigate('AddWord')}
                    data={this.state.Words}
                />)}
                <AddActionButton
                    onPress={() => this.props.navigation.navigate('AddWord')}
                />
            </View>
        )

    };
}