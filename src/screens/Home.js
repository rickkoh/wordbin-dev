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
            title: 'Home',
        }

        console.disableYellowBox = true;
    }

    componentWillMount() {
        this.refreshData();
        DeviceEventEmitter.addListener("database_changed", () => this.refreshData());
        DeviceEventEmitter.addListener("change_title", (title) => this.setState({title: title}));
    }

    refreshData = () => {
        console.log('data refreshed');
        this.loadData().then((data) => this.setState(data));
    }

    loadData = () => {

        async function asyncForEach(array, callback) {
            for (let index = 0; index < array.length; index++) {
                await callback(array[index], index, array);
            }
        }

        entities = {}

        return new Promise(async (resolve, reject) => {
            await database.getWords().then(async data => {
                entities.Words = data;
                await asyncForEach(data, async (word, word_index) => {
                    await database.getWordTags(word.word_id).then(async data => {
                        entities.Words[word_index].Tags = data;
                    })
                    .catch(error => reject(error))
                    await database.getMeanings(word.word_id).then(async data => {
                        entities.Words[word_index].Meanings = data;
                        await asyncForEach(data, async (meaning, meaning_index) => {
                            await database.getWordSynonym(meaning.meaning_id).then(async data => {
                                entities.Words[word_index].Meanings[meaning_index].Synonyms = data;
                            })
                            .catch(error => reject(error))
                        })
                    })
                    .catch(error => reject(error))
                })

                // Async test: Done should be called before entities obj is returned
                // console.log('Done');
            })
            .then(() => resolve(entities))
            .catch(error => reject(error))
        })
    }

    test = () => {
        this.loadData().then((data) => console.log(data));
    }

    // Render
    render() {
        console.log("render")
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
                        onPress={() => this.props.navigation.navigate('AddWord')}
                    >
                        <Text style={{color: colors.default.blue, fontSize: 16, marginBottom: 100, fontWeight: 'bold'}}>Add Your First Word</Text>
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