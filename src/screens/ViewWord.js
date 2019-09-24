import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity, ListView, FlatList } from 'react-native';
import { Icon } from 'react-native-elements';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { SQLite } from 'expo-sqlite';

import { headerStyles } from '../Styles';

const db = SQLite.openDatabase('db.db');

const colors = {
    default: {
        primaryColor: 'white',
        secondaryColor: 'black',
        tertiaryColor: '#212121',
    },
    subdue: {
        primaryColor: '#336B87',
        secondaryColor: 'white',
        tertiaryColor: '#212121',
    },
    wordy: {
        primaryColor: '#F1DCC9',
        secondaryColor: '#000000',
        tertiaryColor: '#212121',
    },
}

export default class ViewWordScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerStyle: {
                borderBottomWidth: 0,
                backgroundColor: colors.subdue.primaryColor,
            },
            headerLeft: (
                <TouchableOpacity
                   onPress={() => navigation.goBack()}
                   style={styles.headerButton}>
                   <Icon name='arrow-back' color={colors.subdue.secondaryColor}/>
                 </TouchableOpacity>
            ),
            headerRight: (
                <TouchableOpacity
                   style={styles.headerButton}>
                   <Icon name='edit' color={colors.subdue.secondaryColor}/>
                 </TouchableOpacity>
            ),
        }
    }

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={headerStyles.header}>
                    <View style={headerStyles.headerLeft}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.goBack()}
                            style={headerStyles.headerButtonLeft}>
                            <Icon name='arrow-back' color={colors.subdue.secondaryColor}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.wordContainer}>
                    <Text style={{fontSize: 24, color: colors.subdue.secondaryColor}}>{this.props.navigation.state.params.word.word_text}</Text>
                </View>
                <View style={styles.meaningContainer}>
                    <FlatList
                        data={this.props.navigation.state.params.word.meaning}
                        renderItem={({item, index}) =>
                            <View style={styles.meaningRow}>
                                <Text style={{color: colors.subdue.secondaryColor}}>{index+1}. </Text>
                                <Text style={{color: colors.subdue.secondaryColor}}>{item.meaning_text}</Text>
                            </View>
                        }
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    primaryText: {
        color: colors.subdue.secondaryColor,
    },
    headerButton:{
        paddingHorizontal: 20,
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderColor: '#ffffff',
        color: colors.subdue.secondaryColor,
    },
    container: {
        flex: 1,
        backgroundColor: colors.subdue.primaryColor,
    },
    wordContainer: {
        padding: 20,
    },
    meaningContainer: {
        flex: 1,
    },
    meaningRow: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 15,
        marginHorizontal: 20,
    },
    tagsContainer: {
        flex: 1,
    },
})
