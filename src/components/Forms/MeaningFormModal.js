import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, TextInput, Text } from 'react-native';

import Modal from 'react-native-modal';

import Header from '../../components/Header';
import { headerStyles, colors } from '../../Styles';
import TextButton from '../TextButton';

class MeaningFormModal extends React.Component {

    render() {
        return(
            <Modal
                isVisible={this.props.isVisible}
                swipeDirection={['down']}
                swipeThreshold={300}
                onSwipeComplete={this.props.toggleVisibility}
                // onShow={() => this.wordInput.focus()}
                style={{margin: 0}}
            >
                <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                    <View style={styles.modal}>
                        <Header
                            headerRight={
                                <TextButton text="Done" style={headerStyles.headerButtonRight} onPress={this.props.toggleVisibility}/>
                            }
                        />
                        <Text style={{fontSize: 24, marginLeft: 20, color: this.props.meaning.meaning_text == undefined ? colors.default.gray : colors.default.black}}>{this.props.meaning.meaning_text == undefined ? "Meaning of word" : this.props.meaning.meaning_text}</Text>
                        <TextInput
                            multiline
                            ref={ref => this.wordInput = ref}
                            style={styles.textBox}
                            placeholder="Sentence Example"
                        />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Synonyms"
                        />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Antonyms"
                        />
                        <TextInput
                            style={styles.lastTextInput}
                            placeholder="Origin"
                        />
                        <KeyboardBar renderContent={this.props.keyboardBar}/>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        )
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
        // marginTop: 37.5,
        // borderTopLeftRadius: 30,
        // borderTopRightRadius: 30,
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
        marginTop: 20,
        marginHorizontal: 20,
        textAlignVertical: 'top',
        fontSize: 16
    },
    textInput: {
        flex: 1,
        marginTop: 20,
        marginHorizontal: 20,
        fontSize: 16
    },
    lastTextInput: {
        margin: 20,
        fontSize: 16
    }
})

export default MeaningFormModal;