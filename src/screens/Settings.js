import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity, FlatList} from 'react-native';
import * as FileSystem from 'expo-file-system';

import database from '../services/Database';

import { headerStyles } from '../Styles';

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
            <View>
                <View style={headerStyles.header}>
                </View>
                <TouchableOpacity
                    onPress={() => this.populateDatabase()}
                    style={styles.addButton}>
                    <Text style={{color: "white"}}>Populate Dummy Data</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    onPress={() => this.downloadDictionaryDatabase()}
                    style={styles.addButton}>
                    <Text style={{color: "white"}}>Download Dictionary</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => this.resetDatabase()}
                    style={styles.addButton}>
                    <Text style={{color: "white"}}>Reset Database</Text>
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
