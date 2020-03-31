import React from 'react';
import { View, DeviceEventEmitter, StyleSheet, Text, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import { withNavigation } from 'react-navigation';

import Modal from 'react-native-modal';
import { WebView } from 'react-native-webview';

import { colors, STATUS_BAR_HEIGHT, SCREEN_HEIGHT } from '../Styles';

import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import database from '../services/Database';

import MeaningInformation from '../components/Information/MeaningInformation';
import TagInformation from '../components/Information/TagInformation';
import EditableWordCardModal from './EditableWordCardModal';
import WordBrowser from './WordBrowser';

// Takes in a
class WordCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isModalVisible: false,
            isCardModalVisible: false,
            // NOTE: Once the 'Done' button is clicked the word information
            // will be updated with the editedWord information in the database
            editedWord: {
                word_text: this.props.word.word_text,
                word_pronunciation: this.props.word.word_pronunciation,
            }
        }
    }

    cleanString() {
        this.cleanTag();
    }

    cleanTag() {
        // Adding header
        // TODO: Might not be a proper way to do this. Needs a revamp
        if (this.props.word.Tags.length > 0 && this.props.word.Tags[0].tag_title != "Tags: ") {
            this.props.word.Tags.unshift({tag_title: "Tags: "})
        }
    }

    hideMenu() {
        this._menu.hide();
    }

    toggleModalVisibility = () => {
        this.setState(prevState => ({isModalVisible: !prevState.isModalVisible}))
    }

    render() {

        this.cleanString();

        // Render WordCard
        return(
            <View style={[{ minHeight: 20, margin: 10, marginBottom: 0, padding: 10, borderRadius: 10, backgroundColor: 'white'}, styles.boxWithShadow]}>
                {
                    // Header
                    this._renderHeader()
                }
                {
                    // Title
                }
                <Text style={{fontSize: 20, marginBottom: 5}} onPress={() => this.setState({isCardModalVisible: true})}>{this.props.word.word_text}</Text>
                {
                    // Pronunciation
                }
                {this.props.word.word_pronunciation == undefined ? null : (
                    <Text style={{fontSize: 12, marginBottom: 5 }}>{this.props.word.word_pronunciation}</Text>
                )}
                {
                    // Meanings
                }
                <MeaningInformation
                    data={this.props.word.Meanings}
                />
                {
                    // Tags
                }
                <TagInformation
                    data={this.props.word.Tags}
                />
                {
                    // Google Search Button
                }
                <View style={{alignItems: 'flex-end'}}>
                    <TouchableOpacity onPress={this.toggleModalVisibility}>
                        <Image source={require('../assets/googlelogo1.jpg')} style={{height: 20, width: 20}}></Image>
                    </TouchableOpacity>
                </View>

                {
                    // Browser
                }
                <WordBrowser isVisible={this.state.isModalVisible} word={this.props.word.word_text} onCloseButtonPress={() => this.setState({isModalVisible: false})}/>
                {
                    // WordCardModal
                }
                <EditableWordCardModal
                    isVisible={this.state.isCardModalVisible}
                    onDoneButtonPress={() => this.setState({isCardModalVisible: false})}
                    onBackdropPress={() => this.setState(prevState => ({isCardModalVisible: !prevState.isCardModalVisible}))}
                    word={this.props.word}
                    onWordDataChange={(word) => console.log(word)}
                />
            </View>
        )
    }

    _renderHeader = () => {
        return (
            <View style={{alignItems: 'flex-end'}}>
                {
                    // Menu
                }
                <TouchableOpacity style={{paddingLeft: 10, paddingRight: 5}} onPress={() => {
                    this._menu.show();
                }}>
                    <Text style={{fontWeight: 'bold'}}>...</Text>
                    {this._renderMenu()}
                </TouchableOpacity>
            </View>
        )
    }

    _renderMenu = () => {
        return(
            <Menu ref={(ref) => this._menu = ref} style={{backgroundColor: 'black'}}>
                <MenuItem onPress={() => {
                    console.log('Edit ' + this.props.word.word_text);
                    this.hideMenu();
                }}>
                    <Text style={{color: 'white'}}>Hide</Text>
                </MenuItem>
                <MenuItem onPress={() => {
                    console.log('Edit ' + this.props.word.word_text);
                    this.hideMenu();
                }}>
                    <Text style={{color: 'white'}}>Edit</Text>
                </MenuItem>
                <MenuItem onPress={() => {
                    console.log('Move item up');
                    this.hideMenu();
                }}>
                    <Text style={{color: 'white'}}>Shift Up</Text>
                </MenuItem>
                <MenuItem onPress={() => {
                    console.log('Move item down');
                    this.hideMenu();
                }}>
                    <Text style={{color: 'white'}}>Shift Down</Text>
                </MenuItem>
                <MenuItem onPress={() => {
                    database.deleteWord(this.props.word.word_id).then(() => DeviceEventEmitter.emit('database_changed'));
                    this.hideMenu();
                }}>
                    <Text style={{color: 'white'}}>Delete</Text>
                </MenuItem>
            </Menu>
        )

    }
}

const styles = StyleSheet.create({
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
    }
})

export default withNavigation(WordCard);
