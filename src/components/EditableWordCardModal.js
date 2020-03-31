import React from 'react';
import { DeviceEventEmitter, View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';

import { SCREEN_HEIGHT, colors } from '../Styles';

import Modal from 'react-native-modal';
import PillButton from '../components/PillButton';

import MeaningInformation from '../components/Information/MeaningInformation';
import TagInformation1 from '../components/Information/TagInformation1';

import WordInput from '../components/Forms/WordInput';
import PronunciationInput from '../components/Forms/PronunciationInput';
import MeaningForm from '../components/Forms/MeaningForm';
import TagForm from '../components/Forms/TagForm';
import database from '../services/Database';

class EditableWordCardModal extends React.Component {

    constructor(props) {
        super(props);

        // Self-governing modal - cohesiveness
        // Props
        // isEditable
        // isVisible
        // onBackdropPress

        // Get word
        // Copy word
        // Edit copied word
        // a. Saves the edited word
        // b. Revert the changes

        this.state = {
            isEditable: false,
            word: this.props.word,
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // Reset the isEditable back to default
        if (!this.props.isVisible && this.state.isEditable) {
            this.setState({isEditable: false});
        }

        if (this.state != prevState) {
            this.props.onWordDataChange ? this.props.onWordDataChange(this.state.word) : null;
        }
    }

    // Handles onBackdropPress
    onBackdropPress = () => {
        console.log(this.state.word);
        this.setState({isEditable: false});
        try {
            this.props.onBackdropPress();
        } catch { }
    }

    // Handles onEditButtonPress
    onEditButtonPress = () => {
        this.setState(prevState => ({isEditable: !prevState.isEditable}));
        try {
            this.props.onEditButtonPress();
        } catch { }
    }

    // Handles onCancelButtonPress
    onCancelButtonPress = () => {
        this.setState(prevState => ({isEditable: !prevState.isEditable}));
        try {
            this.props.onCancelButtonPress();
        } catch { }
    }

    // Hanldes onDoneButtonPress
    onDoneButtonPress = () => {
        // Perform SQL update query
        // Return new Promise
        // reject: return false
        // success: return word object

        async function asyncForEach(array, callback) {
            for (let index = 0; index < array.length; index++) {
                await callback(array[index], index, array);
            }
        }

        databaseChanged = false;

        // Update word
        database.updateWord(this.state.word.word_id, this.state.word.word_text).then(rowsAffected => {
            if (rowsAffected !== undefined && rowsAffected > 0) {
                databaseChanged = true;
            }
        });

        // Update meaning
        asyncForEach(this.state.word.Meanings, async (meaning, index) => {
            // Check if meaning object changed
            if (this.state.word.Meanings[index] != meaning) {
                await database.updateMeaningText(meaning.meaning_id, meaning.meaning_text).then(rowsAffected => {
                    if (rowsAffected !== undefined && rowsAffected > 0) {
                        databaseChanged = true;
                    }
                })
            }
        });

        if (databaseChanged) DeviceEventEmitter.emit("database_changed");

        try {
            this.props.onDoneButtonPress();
        } catch { }
    }

    // Render modal content based on editable
    renderModalContent = () => {
        if (!this.state.isEditable) {
            // Render normal WordCardModal
            return (
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => this.onEditButtonPress()}>
                            <Text style={{fontSize: 18, color: colors.default.blue}}>Edit</Text>
                        </TouchableOpacity>
                        <PillButton
                            text="Done"
                            onPress={() => this.onDoneButtonPress()}
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
            )
        } else {
            // Render editable WordCardModal
            return (
                <View style={styles.container}>
                    {
                        // Header
                    }
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => this.onCancelButtonPress()}>
                            <Text style={styles.cancelButton}>Cancel</Text>
                        </TouchableOpacity>
                        <PillButton
                            text="Done"
                            onPress={() => this.onDoneButtonPress()}
                            style={{marginBottom: 10}}
                        />
                    </View>
                    <ScrollView>
                        <WordInput
                            value={this.state.word.word_text}
                            onChangeText={(text) => this.setState((prevState) => ({word: { ...prevState.word, word_text: text}}))}
                        />
                        <PronunciationInput
                            value={this.state.word.word_pronunciation}
                            onChangeText={(text) => this.setState((prevState) => ({word: { ...prevState.word, word_pronunciation: text}}))}
                        />
                        <MeaningForm
                            autofocus
                            data={this.state.word.Meanings}
                            onMeaningIndexChange={() => console.log('display')}
                            onMeaningDataChange={(meaning) =>  {
                                word = this.state.word;
                                word.Meanings = meaning;
                                this.setState({word: word})
                                console.log(this.state.word);
                            }}
                        />
                        <TagForm
                            data={this.state.word.Tags}
                            onTagDataChange={(tag) => {
                                console.log(tag);
                                this.setState((prevState) => ({word: { ...prevState.word, Tags: tag}}))}
                            }
                        />
                    </ScrollView>
                </View>
            )
        }
    }

    render() {
        return(
            <Modal
                onBackdropPress={() => this.onBackdropPress()}
                isVisible={this.props.isVisible}
            >
                {
                    // Modal container
                }
                {this.renderModalContent()}
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        marginHorizontal: 20,
        marginVertical: SCREEN_HEIGHT*0.1,
        borderRadius: 20,
        padding: 20
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cancelButton: {
        fontSize: 18,
        color: colors.default.blue
    }
})

export default EditableWordCardModal;