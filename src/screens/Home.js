import React from 'react';
import { Text, View, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { Icon } from 'react-native-elements';

import ignoreWarnings from 'react-native-ignore-warnings';

import { headerStyles, colors } from '../Styles';

import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

import AddWordModal from './AddWordModal';

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
            isModalVisible: false,
        }

        ignoreWarnings('error', ['Warning', 'Error']);
        console.disableYellowBox = true;
    }

    componentWillMount() {
        this.refreshData();
        DeviceEventEmitter.addListener("database_changed", () => this.refreshData());
        DeviceEventEmitter.addListener("filter_by_wordseries", (tag) => {

        })
        DeviceEventEmitter.addListener("change_title", (tag) => {
            this.state.title = tag.tag_title;
            this.loadData("tag", [tag.tag_id]).then(data => this.setState(data));
        });
    }

    refreshData = () => {
        console.log("refresh data called");
        this.state.title = "Home";
        this.loadData().then((data) => this.setState(data));
    }

    // opts: tags, series, default etc
    // args: arguments
    loadData = (opts, args) => {

        entities = {}

        async function asyncForEach(array, callback) {
            for (let index = 0; index < array.length; index++) {
                await callback(array[index], index, array);
            }
        }

        if (opts == "tag") {
            // "tag", [tag_id]
            return new Promise(async (resolve, reject) => {
                await database.getWordsByTags(args[0]).then(async data => {
                    entities.Words = data;
                    await clip(data);
                })
                .then(() => resolve(entities))
                .catch(error => reject(error))
            })
        } else {
            // default
            return new Promise(async (resolve, reject) => {
                await database.getWords().then(async data => {
                    entities.Words = data;
                    await clip(data);
                })
                .then(() => resolve(entities))
                .catch(error => reject(error))
            })
        }

        // Clip word data
        async function clip(data) {
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
        }

    }

    toggleModalVisibility = () => {
        console.log('toggling');
        this.setState(prevState => ({isModalVisible: !prevState.isModalVisible}))
    }

    test = () => {
        // console.log(this.state);
        this._menu.show();
        // this.toggleModalVisibility();
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
                        <Text style={headerStyles.headerTitle} onPress={() => this.refreshData()}>
                            {this.state.title}
                        </Text>
                    }
                    headerRight={
                        <TouchableOpacity
                            onPress={this.test}
                            style={headerStyles.headerButtonRight}>
                            <Icon name='grid' type="entypo" color={colors.default.primaryColor}/>
                            <Menu ref={(ref) => this._menu = ref}
                                style={{backgroundColor: 'black'}}
                            >
                                <MenuItem onPress={this.hideMenu}><Text style={{color: 'white'}}>Alphabet</Text></MenuItem>
                                <MenuItem onPress={this.hideMenu}><Text style={{color: 'white'}}>Latest</Text></MenuItem>
                                <MenuItem onPress={this.hideMenu}><Text style={{color: 'white'}}>Earliest</Text></MenuItem>
                                <MenuDivider color={colors.default.lightgray} />
                                <MenuItem onPress={this.hideMenu}><Text style={{color: 'white'}}>Custom</Text></MenuItem>
                            </Menu>
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
                    onPress={() => this.props.navigation.navigate("AddWord")}
                />

                <AddWordModal
                    isVisible={this.state.isModalVisible}
                    toggleVisibility={this.toggleModalVisibility}
                />

            </View>
        )

    };
}