import React from 'react-native';
import { View, StyleSheet, Text } from 'react-native';

import { SCREEN_HEIGHT, colors } from '../Styles';

import PillButton from '../components/PillButton';

import WordInput from '../components/Forms/WordInput';
import PronunciationInput from '../components/Forms/PronunciationInput';
import MeaningForm from '../components/Forms/MeaningForm';
import TagForm from '../components/Forms/TagForm';

class EditableWordCardModal extends React.Component {

    constructor(props) {
        // Self-governing modal - cohesiveness
        // Find all the props
        // isVisible
        // onBackdropPress

        // Get the word
        // Copy the word
        // Edit copied word
        // a. Saves the edited word
        // b. Revert the changes
        this.state = {
            word: this.props.word,
        }
    }

    onCancelButtonPress = () => {
        this.props.onCancelButtonPress();
    }

    onDoneButtonPress = () => {
        // Perform SQL update query
        // Return new Promise
        // reject: return false
        // success: return word object
        this.props.onDoneButtonPress();
    }

    render() {
        return(
            <View>
                {
                    // Modal
                }
                <Modal
                    onBackdropPress={this.props.onBackdropPress}
                    isVisible={this.props.isVisible}
                >
                    {
                        // Modal container
                    }
                    <View style={styles.container}>
                        {
                            // Header
                        }
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => this.onCancelButtonPress}>
                                <Text style={styles.cancelButton}>Cancel</Text>
                            </TouchableOpacity>
                            <PillButton
                                text="Done"
                                onPress={() => this.onDoneButtonPress}
                                style={{marginBottom: 10}}
                            />
                        </View>
                        <ScrollView>
                            <WordInput
                                value={this.state.editedWord.word_text}
                                onChangeText={(text) => this.setState((prevState) => ({editedWord: { ...prevState.editedWord, word_text: text}}))}
                            />
                            <PronunciationInput
                                value={this.state.editedWord.word_pronunciation}
                                onChangeText={(text) => this.setState((prevState) => ({editedWord: { ...prevState.editedWord, word_pronunciation: text}}))}
                            />
                            <MeaningForm
                                autofocus
                                data={this.props.word.Meanings}
                                onMeaningIndexChange={() => console.log('display')}
                            />
                            <TagForm
                                value=""
                                data={this.props.word.Tags}
                                onMeaningIndexChange={() => console.log("test")}
                            />
                        </ScrollView>
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white', marginHorizontal: 20, marginVertical: SCREEN_HEIGHT*0.1, borderRadius: 20, padding: 20
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