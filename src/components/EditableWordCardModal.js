import React from 'react';
import { DeviceEventEmitter, View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';

import { SCREEN_HEIGHT, colors } from '../Styles';

import Modal from 'react-native-modal';
import PillButton from '../components/PillButton';

import MeaningInformation from '../components/Information/MeaningInformation';
import TagInformation from '../components/Information/TagInformation';

import WordInput from '../components/Forms/WordInput';
import PronunciationInput from '../components/Forms/PronunciationInput';
import MeaningForm from '../components/Forms/MeaningForm';
import TagForm from '../components/Forms/TagForm';
import database from '../services/Database';

class EditableWordCardModal extends React.Component {

    constructor(props) {
        super(props);

        // Props
        // isEditable
        // isVisible
        // onBackdropPress

        this.state = {
            isVisible: false,
            isEditable: false,
            isEdited: false,
            word: JSON.parse(JSON.stringify(this.props.word)),
        }

    }

    componentDidUpdate(prevProps, prevState) {
        // Update isEdited state if word is edited
        // CONDITION: Word isn't the same as before AND isEdited is still false AND word can be edited (isEditable is true)
        if (this.state.word != prevState.word && !this.state.isEdited && this.state.isEditable) this.setState({isEdited: true});

        // Call onWordDataChange function is word isn't the same as before
        if (this.state.word != prevState.word) {
            // Can remove
            console.log("Word data changed.");
            this.props.onWordDataChange ? this.props.onWordDataChange(this.state.word) : null;
        }

        // Modal state is defined as 'destroyed' when it is no longer visible
        // Reset properties back to default
        if (!this.props.isVisible && this.props.isVisible != prevProps.isVisible) {

            // Can remove
            console.log("Resetting");

            // Default states (same as the one in constructor)
            this.state = {
                isEditable: false,
                isEdited: false,
                word: JSON.parse(JSON.stringify(this.props.word)),
            }

            this.setState(this.state);
        }
    }

    setIsEditable = (value) => {
        value ? this.setState({isEditable: value}) : this.setState({isEditable: true})
    }

    // Handles onBackdropPress
    onBackdropPress = () => {
        if (this.state.isEdited) {
            // Can remove
            console.log("Detects word edited.");
            // Prompts user if he/she wants to save changes
        }
        this.props.onBackdropPress ? this.props.onBackdropPress() : null;
    }

    // Handles onEditButtonPress
    onEditButtonPress = () => {
        this.setState({isEditable: true})
        this.props.onEditButtonPress ? this.props.onEditButtonPress() : null;
    }

    // Handles onCancelButtonPress
    onCancelButtonPress = () => {
        this.setState({isEditable: false});
        this.props.onCancelButtonPress ? this.props.onCancelButtonPress() : null;
    }

    // Handles onDoneButtonPress
    onDoneButtonPress = () => {
        // Function shouldn't be executed
        if (this.state.isEdited) {
            this.updateData();
            this.props.onWordDataHasChanged ? this.props.onWordDataHasChanged(this.state.word) : null;
        }
        this.props.onDoneButtonPress ? this.props.onDoneButtonPress() : null;
    }

    updateData = () => {
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
    }

    // Render modal content based on editable
    renderModalContent = () => {
        if (!this.state.isEditable) {
            // Render normal WordCardModal
            // Uses data from prop
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
                        <TagInformation
                            header
                            headerText="Tags"
                            data={this.props.word.Tags}
                        />
                    </ScrollView>
                </View>
            )
        } else {
            // Render editable WordCardModal
            // Uses data from state
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
                            onMeaningIndexChange={() => console.log('Meaning index changed.')}
                            onMeaningDataChange={(meaning) =>  {
                                console.log("Meaning data changed.");
                                word = this.state.word;
                                word.Meanings = meaning;
                                this.setState({word: JSON.parse(JSON.stringify(word))})
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