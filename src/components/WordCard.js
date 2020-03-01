import React from 'react';
import { View, ScrollView, DeviceEventEmitter, StyleSheet, Text, FlatList, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import { withNavigation } from 'react-navigation';

import Modal from 'react-native-modal';
import { WebView } from 'react-native-webview';

import { colors, STATUS_BAR_HEIGHT, SCREEN_HEIGHT } from '../Styles';

import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

import Tag from './Tag';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import database from '../services/Database';

import MeaningInformation from '../components/Information/MeaningInformation';
import TagInformation from '../components/Information/TagInformation';
import TagInformation1 from '../components/Information/TagInformation1';

import PillButton from '../components/PillButton';
import HorizontalList from './HorizontalList';

class WordCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isModalVisible: false,
            isModalEditable: false,
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

    // WordCard is the card itself
    // It should be editable WordCardModal
    // and WordCardModal

    renderWordCardModal = () => {
        return(
            <Modal
                onBackdropPress={() => this.setState({isCardModalVisible: false})}
                isVisible={this.state.isCardModalVisible}
            >
                {
                    // View/Edit Word modal
                }
                <View style={{flex: 1, backgroundColor: 'white', marginHorizontali: 20, marginVertical: SCREEN_HEIGHT*0.1, borderRadius: 20, padding: 20}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <TouchableOpacity onPress={() => {
                            console.log(this.props.word);
                            this.setState(prevState => ({isModalEditable: !prevState.isModalEditable}));
                        }}>
                            <Text style={{fontSize: 18, color: colors.default.blue}}>Edit</Text>
                        </TouchableOpacity>
                        <PillButton
                            text="Done"
                            onPress={() => this.setState({isCardModalVisible: false})}
                            style={{marginBottom: 10}}
                        />
                    </View>
                    <ScrollView>
                        <Text style={{fontSize: 22}}>{this.props.word.word_text}</Text>
                        <Text>{this.props.word.word_pronunciation}</Text>
                        <MeaningInformation
                            data={this.props.word.Meanings}
                        />
                        <TagInformation1
                            data={this.props.word.Tags} 
                        />
                    </ScrollView>
                </View>
            </Modal>
        )
    }

    renderEditableWordCardModal = () => {
        return(
            <Modal
                onBackdropPress={() => this.setState({isCardModalVisible: false})}
                isVisible={this.state.isCardModalVisible}
            >
                {
                    // View/Edit Word modal
                }
                <View style={{flex: 1, backgroundColor: 'white', marginHorizontali: 20, marginVertical: SCREEN_HEIGHT*0.1, borderRadius: 20, padding: 20}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <TouchableOpacity onPress={() => {
                            console.log(this.props.word);
                            this.setState(prevState => ({isModalEditable: !prevState.isModalEditable}));
                        }}>
                            <Text style={{fontSize: 18, color: colors.default.blue}}>Edit</Text>
                        </TouchableOpacity>
                        <PillButton
                            text="Done"
                            onPress={() => this.setState({isCardModalVisible: false})}
                            style={{marginBottom: 10}}
                        />
                    </View>
                    <ScrollView>
                        <Text style={{fontSize: 22}}>Edit Mode on</Text>
                        <Text>{this.props.word.word_pronunciation}</Text>
                        <MeaningInformation
                            data={this.props.word.Meanings}
                        />
                        <TagInformation1
                            data={this.props.word.Tags} 
                        />
                    </ScrollView>
                </View>
            </Modal>
        )
    }

    renderBrowser = () => {
        return(
            <Modal
                isVisible={this.state.isModalVisible}
                style={{margin: 0}}
            >
                <View style={{flex: 1}}>
                    <View style={{height: STATUS_BAR_HEIGHT+40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.default.white, paddingTop: STATUS_BAR_HEIGHT}}>
                        <TouchableOpacity style={{paddingHorizontal: 15}} onPress={() => this.setState({isModalVisible: false})}>
                            <Icon name='close' type='evilicon' size='30' onPress={() => this.setState({isModalVisible: false})}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={{paddingHorizontal: 15}} onPress={() => this.setState({isModalVisible: false})}>
                            <Icon name='ellipsis1' type='antdesign' size='30' onPress={() => this.setState({isModalVisible: false})}/>
                        </TouchableOpacity>
                    </View>
                    <WebView
                        source={{uri: "https://www.google.com/search?q=define "+this.props.word.word_text.toLowerCase()}}
                    />
                </View>
            </Modal>
        )
    }

    render() {
        
        this.cleanString();

        // Render WordCard
        return(
            <View style={[{ minHeight: 20, margin: 10, marginBottom: 0, padding: 10, borderRadius: 10, backgroundColor: 'white'}, styles.boxWithShadow]}>
                {
                    // Header
                }
                <View style={{alignItems: 'flex-end'}}>
                    {
                        // Menu
                    }
                    <TouchableOpacity style={{paddingLeft: 10, paddingRight: 5}} onPress={() => {
                        this._menu.show();
                    }}>
                        <Text style={{fontWeight: 'bold'}}>...</Text>
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
                    </TouchableOpacity>
                </View>
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
                {this.renderBrowser()}
                {
                    // WordCardModal
                }
                {this.state.isModalEditable ? this.renderEditableWordCardModal() : this.renderWordCardModal()}
            </View>
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