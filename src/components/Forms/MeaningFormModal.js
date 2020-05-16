import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, TextInput, Text } from 'react-native';

import Modal from 'react-native-modal';

import Header from '../../components/Header';
import { headerStyles, colors } from '../../Styles';
import TextButton from '../Buttons/TextButton';
import PillButton from '../Buttons/PillButton';
import { TouchableOpacity } from 'react-native-gesture-handler';

import TagForm from './TagForm';

class MeaningFormModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            renderMode: 'sentence',
            Tags: [],
        }
    }

    render() {
        return(
            <Modal
                isVisible={this.props.isVisible ? this.props.isVisible : false}
                // swipeDirection={['down']}
                // swipeThreshold={300}
                // onSwipeComplete={this.props.toggleVisibility}
                // onShow={() => this.wordInput.focus()}
                style={{margin: 0}}
            >
                <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                    <View style={styles.modal}>
                        {
                            this._renderHeader()
                        }
                        {
                            this._renderTabs()
                        }
                        {
                            this._renderForm()
                        }
                        <KeyboardBar renderContent={this.props.keyboardBar}/>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        )
    }

    _renderHeader() {
        return(
            <View style={{marginTop: 20, flexDirection: 'row'}}>
                <Text style={{flex: 1, fontSize: 24, marginLeft: 20, color: this.props.meaning.meaning_text == undefined ? colors.default.gray : colors.default.black}}>{this.props.meaning.meaning_text == undefined ? "" : this.props.meaning.meaning_text}</Text>
                <TextButton text="Done" onPress={this.props.toggleVisibility}/>
            </View>
        )
    }

    _renderTabs() {
        return(
            <View style={{flexDirection: 'row', height: 30, marginTop: 20}}>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity onPress={() => this.setState({renderMode: 'sentence'})}>
                        <View style={this.state.renderMode == 'sentence' ? styles.tabButtonEnabled : null}>
                            <Text style={this.state.renderMode == 'sentence' ? styles.tabTextEnabled : styles.tabTextDisabled}>Sentence</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity onPress={() => this.setState({renderMode: 'synonyms'})}>
                        <View style={this.state.renderMode == 'synonyms' ? styles.tabButtonEnabled : null}>
                            <Text style={this.state.renderMode == 'synonyms' ? styles.tabTextEnabled : styles.tabTextDisabled}>Synonyms</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity onPress={() => this.setState({renderMode: 'antonyms'})}>
                        <View style={this.state.renderMode == 'antonyms' ? styles.tabButtonEnabled : null}>
                            <Text style={this.state.renderMode == 'antonyms' ? styles.tabTextEnabled : styles.tabTextDisabled}>Antonyms</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    _renderForm() {
        switch(this.state.renderMode) {
            case 'sentence': {
                return(
                    <TextInput
                        multiline
                        ref={ref => this.wordInput = ref}
                        style={styles.textBox}
                        placeholder="Sentence Example"
                    />
                )
            }
            case 'synonyms': {
                return(
                    <TextInput
                        style={styles.textInput}
                        placeholder="Synonyms"
                    />
                )
            }
            case 'antonyms': {
                return(
                    <TagForm style={{flex: 1, maxHeight: 300, margin: 20}} data={this.state.Tags}>

                    </TagForm>
                )
            }
            default: {
                this.setState({renderMode: 'sentence'});
                return null;
            }
        }
    }

    _renderSentenceForm() {
        return (
            <TextInput
                multiline
                ref={ref => this.wordInput = ref}
                style={styles.textBox}
                placeholder="Sentence Example"
            />
        )
    }

    _renderSynonymsForm() {

    }

    _renderAntonymsForm() {

    }
}

KeyboardBar = (props) => {
        return(
            <View style={{borderTopWidth: 1, borderColor: '#f4f7f8', height: 50, alignItems: 'center', paddingHorizontal: 20}}>
                {props.renderContent}
            </View>
        )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    modal: {
        flex: 1,
        marginTop: 37.5,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: colors.default.backgroundColor
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    textBox: {
        flex: 1,
        margin: 20,
        textAlignVertical: 'top',
        fontSize: 16
    },

    textInput: {
        flex: 1,
        marginTop: 20,
        marginHorizontal: 20,
        fontSize: 16
    },
    tabButtonEnabled: {
        borderBottomWidth: 3,
        borderBottomColor: colors.default.blue,
    },
    tabTextEnabled: {
        fontSize: 16,
        color: colors.default.blue
    },
    tabTextDisabled: {
        fontSize: 16,
        color: colors.default.gray
    },
})

export default MeaningFormModal;