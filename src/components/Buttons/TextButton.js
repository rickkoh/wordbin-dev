import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../Styles';

class TextButton extends React.Component {
    
    render() {
        return(
            <View style={(this.props.enabled || this.props.enabled == undefined) ? styles.enabled : styles.disabled}>
                <TouchableOpacity
                    onPress={(this.props.enabled || this.props.enabled == undefined) ? this.props.onPress : null}
                    style={[styles.defaultTextButtonStyle, this.props.style, this.props.backgroundColor == null ? null : {backgroundColor: this.props.backgroundColor}]}>
                    <Text numberOfLines={1} style={[styles.defaultTextStyle, this.props.textColor == null ? null : {color: this.props.textColor}]}>{this.props.text}</Text>
                </TouchableOpacity>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    defaultTextButtonStyle: {
        paddingHorizontal: 20,
        paddingVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    defaultTextStyle: {
        color: colors.default.blue,
        fontSize: 16,
    },
    enabled: {
        opacity: 1,
    },
    disabled: {
        opacity: 0.25,
    }
})

export default TextButton;