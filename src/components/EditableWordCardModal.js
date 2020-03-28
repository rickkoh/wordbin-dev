import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';

import { SCREEN_HEIGHT, colors } from '../Styles';

import Modal from 'react-native-modal';
import PillButton from '../components/PillButton';

import MeaningInformation from '../components/Information/MeaningInformation';
import TagInformation1 from '../components/Information/TagInformation1';

import WordInput from '../components/Forms/WordInput';
import PronunciationInput from '../components/Forms/PronunciationInput';
import MeaningForm from '../components/Forms/MeaningForm';
import TagForm from '../components/Forms/TagForm';

class EditableWordCardModal extends React.Component {

    constructor(props) {
        super(props);

        // Self-governing modal - cohesiveness
        // Find all the props
        // isEditable
        // isVisible
        // onBackdropPress

        // Get the word
        // Copy the word
        // Edit copied word
        // a. Saves the edited word
        // b. Revert the changes
        this.state = {
            isEditable: false,
            word: this.props.word,
        }
    }

    componentDidUpdate() {
        // Reset the isEditable back to default
        if (!this.props.isVisible && this.state.isEditable) {
            this.setState({isEditable: false});
        }
    }

    onBackdropPress = () => {
        this.setState({isEditable: false});
        try {
            this.props.onBackdropPress();
        } catch { }
    }

    onEditButtonPress = () => {
        this.setState(prevState => ({isEditable: !prevState.isEditable}));
        try {
            this.props.onEditButtonPress();
        } catch { }
    }

    onCancelButtonPress = () => {
        this.setState(prevState => ({isEditable: !prevState.isEditable}));
        try {
            this.props.onCancelButtonPress();
        } catch { }
    }

    onDoneButtonPress = () => {
        // Perform SQL update query
        // Return new Promise
        // reject: return false
        // success: return word object
        try {
            this.props.onDoneButtonPress();
        } catch { }
    }

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
                            value="test"
                            data={this.state.word.Tags}
                            onMeaningIndexChange={() => console.log("test")}
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