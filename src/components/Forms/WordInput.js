import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

class WordInput extends React.Component {

    focus = () => {
        this.textInput.blur();

        setTimeout(() => {
            this.textInput.focus();
        }, 100);
    }

    render() {
        return(
            <TextInput
                placeholder="Word"
                ref={(ref) => { this.textInput = ref; }}
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
        fontSize: 26,
        // paddingHorizontal: 20,
    }
})

export default WordInput;