import React from 'react';
import { Text, View, TouchableOpacity, DeviceEventEmitter, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

// Ignore error warnings
import ignoreWarnings from 'react-native-ignore-warnings';

import { headerStyles, colors, SCREEN_HEIGHT } from '../Styles';

import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

// import AddWordModal from './AddWordModal';

import WordCard from '../components/WordCard';
import AddWordCard from '../components/AddWordCard';
import AddActionButton from '../components/AddActionButton';
import database from '../services/Database';

import FlatListWithCollapsibleHeader from '../components/FlatListWithCollapsibleHeader';

// NEEDS REVAMP

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

    header() {
        return(
            <View style={[styles.header, styles.boxWithShadow]}>
                {
                    // Header
                }
                <TouchableOpacity
                    style={{marginLeft: 20}}
                    onPress={() => this.props.navigation.openDrawer()}
                >
                    <Icon name='menu' color={colors.default.primaryColor}/>
                </TouchableOpacity>
                <Text style={[headerStyles.headerTitle, {maxWidth: 200}]} numberOfLines={1} onPress={() => this.refreshData()}>
                    {this.state.title}
                </Text>
                <TouchableOpacity
                    onPress={this.test}
                    style={{marginRight: 20}}>
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
            </View>
        )
    }

    // Render
    render() {
        console.log("render");
        return(
            <View style={{flex: 1, backgroundColor: colors.default.backgroundColor}}>
                {
                    this.state.Words == undefined ? (
                        // Render for the condition: loading
                        <LoadingPage/>
                    ) : 
                    this.state.Words.length <= 0 ? (
                        // Render for the condition: no words
                        <FlatListWithCollapsibleHeader
                            header={this.header()}
                            navHeight={44}
                            containerPaddingTop={10}
                            data={["Add Word Card"]}
                            renderItem={() => <AddWordCard onPress={() => this.props.navigation.navigate("AddWord")}/>}
                        >
                        </FlatListWithCollapsibleHeader>
                    ) : (
                        // Render for the condition: have words
                        <FlatListWithCollapsibleHeader
                            header={this.header()}
                            navHeight={44}
                            containerPaddingTop={0}
                            data={this.state.Words}
                            renderItem={({item}) => <WordCard word={item} onCardPress={this.props.onCardPress}/>}
                        />
                )
            }
            <AddActionButton
                onPress={() => this.props.navigation.navigate("AddWord")}
            />
        </View>
        )
    }
}

function LoadingPage() {
    // Just a loading icon at the middle
    return(
        <View style={[styles.container, styles.center]}>
            <Text>Loading icon here</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        height: 44, borderRadius: 0, marginHorizontal: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.default.white
    },
    card: {
        margin: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: colors.default.white,
        height: SCREEN_HEIGHT * 0.725,
    },
    boxWithShadow: {
        marginBottom: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
})
