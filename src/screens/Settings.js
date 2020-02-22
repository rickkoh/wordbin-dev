import React from 'react';
import { StyleSheet, Image, Text, View, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { Icon } from 'react-native-elements';
import * as FileSystem from 'expo-file-system';

import Header from '../components/Header';

import database from '../services/Database';

import { colors, headerStyles } from '../Styles';
import { FlatList } from 'react-native-gesture-handler';

export default class SettingsScreen extends React.Component {

    constructor(props) {
        super(props);
    }

    // Reset Database
    resetDatabase() {
        database.resetDatabase();
    }

    // Download Dictionary Database
    downloadDictionaryDatabase() {
        FileSystem.downloadAsync('https://github.com/rickkoh/watermelon/raw/master/databases/Dictionary.db', FileSystem.documentDirectory + "SQLite/Dictionary.db")
            .then(({uri}) => {
                console.log('Finished downloading to ', uri);
            })
            .catch(err => {
                console.log(err);
            })
    }

    // Render
    render() {
        return(
            <View style={{flex: 1}}>
                <Header
                    headerLeft={
                        <TouchableOpacity
                            onPress={() => this.props.navigation.openDrawer()}
                            style={headerStyles.headerButtonLeft}>
                            <Icon name='menu' color={colors.default.primaryColor}/>
                        </TouchableOpacity>
                    }
                />
                <TouchableOpacity onPress={() => this.downloadDictionaryDatabase()} style={styles.addButton}>
                    <Text style={{color: "white"}}>Download Dictionary</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {database.resetDatabase(); DeviceEventEmitter.emit("database_changed")}} style={styles.addButton}>
                    <Text style={{color: "white"}}>Reset Database</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => database.printDatabaseLocation()} style={styles.addButton}>
                    <Text style={{color: "white"}}>Print database location in console</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    addButton:{
        padding: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        borderWidth: 1,
        alignItems: 'center',
        backgroundColor: '#2d89ef',
        borderColor: '#ffffff',
    },
});
