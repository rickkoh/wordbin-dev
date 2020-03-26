import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

class PronunciationInput extends React.Component {

    render() {
        return(
            <TextInput
                placeholder="Pronunciation"
                ref={(input) => { this.wordInput = input; }}
                style={styles.textInput}
                value={this.props.value}
                onFocus={this.props.onFocus}
                onChangeText={(text) => this.props.onChangeText(text)}
            />
        )
    }

}

const styles = StyleSheet.create({
    textInput: {
        height: 40,
        fontSize: 16,
        // paddingHorizontal: 20,
    }
});

export default PronunciationInput;