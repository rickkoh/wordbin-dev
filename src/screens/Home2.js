import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity, Vibration, FlatList, SafeAreaView } from 'react-native';
import { Icon, Avatar } from 'react-native-elements';
import { createStackNavigator, createDrawerNavigator, createAppContainer } from 'react-navigation';
import DraggableFlatList from 'react-native-draggable-flatlist';
import Swipeout from 'react-native-swipeout';
import { SQLite } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import * as Haptics from 'expo-haptics';

import { headerStyles, colors } from '../Styles';
import Header from '../components/Header';
import AddActionButton from '../components/AddActionButton';

const db = SQLite.openDatabase('db.db');

const hapticOptions = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false
};

export default class HomeScreen extends React.Component {

    // Navigation Option

    // Constructor
    constructor(props) {
        super(props);

        console.log("constructor");

        this.state = {
            Words: [].map((d, index) => ({
                key: index.toString(),
                label: index,
            })),
            searchQuery: undefined,
        }
    }

    // Callback function for the add word page
    updateDatabase = (word) => {
        console.log("updating");
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM word WHERE word_id = (SELECT MAX(word_id) FROM word);',
                [],
                (_, {rows: { _array } }) => this.state.Words = this.state.Words.concat(_array)
            )
        }, err => {
            console.log(err);
        }, success => {
            console.log("loaded new word");
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM meaning WHERE word_id = (SELECT MAX(word_id) FROM word);',
                    [],
                    (_, {rows: { _array }}) => this.state.Words[this.state.Words.length-1].meaning = _array
                )
            }, err => {
                console.log(err);
            }, success => {
                this.setState({ Words: this.state.Words });
                console.log("loaded new word meanings");
            });
        })
    }
    
    // Retrieve data from the database
    loadDatabase() {
        console.log("loading database");
        // Retrieve all the words
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM Word',
                [],
                (_, {rows: { _array } }) => this.state.Words = _array
            );
        }, err => {
            console.log(err);
        }, success => {
            console.log("successfully loaded words");
            // Retrieve all the meaning of the words
            db.transaction(tx => {
                this.state.Words.forEach(async (item, index) => {
                    tx.executeSql(
                        'SELECT * FROM meaning where word_id = ?',
                        [item.word_id],
                        (_, {rows: { _array }}) => this.state.Words[index].meaning = _array
                    );
                });
            }, err => {
                console.log(err);
            }, success => {
                this.setState({ Words: this.state.Words });
                console.log("successfully loaded meanings");
            });
        });
    }

    // Render word list
    renderContent = (item) => {
        // Render content of each row
        return (
            <DraggableFlatList
                data={item.Words}
                renderItem={this.renderWord}
                keyExtractor={(item, index) => index.toString()}
                scrollPercent={5}
                onMoveBegin = {() => Haptics.notificationAsync('success')}
                onMoveEnd = {({ data }) => this.setState({ Words: data })}
            />
        )
    }

    // Render word
    renderWord = ({ item, index, move, moveEnd, isActive }) => {

        swipeLeftButtons = [
            {
                text: 'Edit',
                backgroundColor: colors.default.blue,
                onPress: () => {this.resetDatabase()},
            },
            {
                text: 'Delete',
                backgroundColor: colors.default.red,
                onPress: () => {this.resetDatabase()},
            },
        ]

        return (
            <View style={styles.wordContainer}>
                    <TouchableOpacity
                        style={styles.wordItem} onLongPress={move} onPressOut={moveEnd}
                        onPress={() => this.props.navigation.push('ViewWord', { word: item })}>
                        <Text style={textStyles.tagsText}>no tags</Text>
                        <Text style={textStyles.wordText}>{item.word_text}</Text>
                        <View>{ this.renderMeaning(item) }</View>
                    </TouchableOpacity>
            </View>
        )
    }

    // Render meaning
    renderMeaning(word) {
        if (word.meaning == null) {
            return (
                <Text style={textStyles.meaningText}></Text>
            )
        }
        if (word.meaning.length > 0) {
            return (
                <Text style={textStyles.meaningText}>{word.meaning[0].meaning_text}</Text>
            )
        }
        return (
            <Text style={textStyles.meaningText}></Text>
        )
    }

    // Handle search query change
    handleSearchChange = (text) => {
        // Do the one second thing here and then run the query
        this.setState({ searchQuery: text });
        this.runSearchQuery(text);
    }

    // Render search
    renderSearchBar = (item) => {

        searchContainer = () => {
            return {
                paddingHorizontal: 10,
                paddingBottom: 10,
                borderBottomWidth: 0.3,
                borderColor: colors.default.gray,
            }
        }

        searchBox = () => {
            return {
                borderRadius: 10,
                paddingHorizontal: 10,
                paddingVertical: 10,
                backgroundColor: colors.default.lightgray,
            }
        }

        return (
            <View
                style={searchContainer()}>
                <TextInput
                    style={searchBox()}
                    value={item.searchQuery}
                    placeholder="Search"
                    onChangeText={(text) => this.handleSearchChange(text)}
                />
            </View>
        )
    }

    // Run search query
    runSearchQuery = (text) => {
        // Retrieve all the words
        text = "%" + text + "%";
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM word WHERE word_text LIKE ?',
                [text],
                (_, {rows: { _array } }) => this.state.Words = _array
            );
        }, err => {
            console.log(err);
        }, success => {
            console.log("successfully loaded words");
            // Retrieve all the meaning of the words
            db.transaction(tx => {
                this.state.Words.forEach(async (item, index) => {
                    tx.executeSql(
                        'SELECT * FROM meaning where word_id = ?',
                        [item.word_id],
                        (_, {rows: { _array }}) => this.state.Words[index].meaning = _array
                    );
                });
            }, err => {
                console.log(err);
            }, success => {
                console.log(this.state.Words);
                this.setState({ Words: this.state.Words });
                console.log("successfully loaded meanings");
            });
        });
    }

    renderHeader = () => {
        return (
            <View style={headerStyles.header}>
                <View style={headerStyles.headerLeft}>
                    <TouchableOpacity
                       onPress={() => this.props.navigation.openDrawer()}
                       style={headerStyles.headerButtonLeft}>
                       <Icon name='menu' color={colors.default.secondaryColor}/>
                     </TouchableOpacity>
                </View>
                <View style={headerStyles.headerCenter}>
                    <Text style={headerStyles.headerTitle}>
                        Home
                    </Text>
                </View>
                <View style={headerStyles.headerRight}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('AddWord', { updateDatabase: this.updateDatabase })}
                        style={headerStyles.headerButtonRight}>
                        <Icon name='add-circle-outline' color={colors.default.primaryColor}/>
                     </TouchableOpacity>
                </View>
            </View>
        )
    }

    // Render
    render() {
        console.log("render");
        return (
            // LIST VIEW HERE
            <View style={styles.container}>
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
                            onPress={() => this.props.navigation.navigate('AddWord', { updateDatabase: this.updateDatabase })}
                            style={headerStyles.headerButtonRight}>
                            <Icon name='add-circle-outline' color={colors.default.primaryColor}/>
                        </TouchableOpacity>
                    }
                />
                { this.renderSearchBar(this.state) }
                { this.renderContent(this.state) }
                <AddActionButton
                    wordList={this.state.Words}
                    onPress={() => this.props.navigation.navigate('AddWord', { updateDatabase: this.updateDatabase })}
                />
            </View>
        )

    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.default.backgroundColor,
    },
    wordContainer: {
        backgroundColor: colors.default.backgroundColor,
        borderBottomWidth: 0,
    },
    wordItem:{
        flex:1,
        justifyContent: 'flex-start',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
});

const textStyles = StyleSheet.create({
    primaryText: {
        color: colors.default.primaryColor,
    },
    secondaryText: {
        color: colors.default.secondaryColor,
    },
    tertiaryText: {
        fontSize: 12,
        color: colors.default.primaryColor,
    },
    wordText: {
        fontSize: 16,
        marginBottom: 2,
        color: colors.default.primaryColor,
    },
    meaningText: {
        fontSize: 12,
        marginBottom: 20,
        color: colors.default.secondaryColor,
    },
    tagsText: {
        fontSize: 10,
        color: colors.default.tertiaryColor,
    },
})


const wordItemStyles = StyleSheet.create({
    wordContainer: {
        backgroundColor: colors.default.backgroundColor,
        borderBottomWidth: 0,
    },
    wordItem:{
        flex:1,
        justifyContent: 'flex-start',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
})
