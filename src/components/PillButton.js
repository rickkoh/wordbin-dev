import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../Styles';

class PillButton extends React.Component {

    render() {
        return(
            <View style={(this.props.enabled || this.props.enabled == undefined) ? styles.enabled : styles.disabled}>
                <TouchableOpacity
                    onPress={(this.props.enabled || this.props.enabled == undefined) ? this.props.onPress : null}
                    style={[styles.defaultPillButtonStyle, this.props.style, this.props.backgroundColor == null ? null : {backgroundColor: this.props.backgroundColor}]}>
                    <Text numberOfLines={1} style={[styles.defaultTextStyle, this.props.textColor == null ? null : {color: this.props.textColor}]}>{this.props.text}</Text>
                </TouchableOpacity>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    defaultPillButtonStyle: {
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 25,
        backgroundColor: colors.default.blue,
        justifyContent: 'center',
        alignItems: 'center',
    },
    defaultTextStyle: {
        color: colors.default.white,
        fontSize: 16,
    },
    enabled: {
        opacity: 1,
    },
    disabled: {
        opacity: 0.25,
    },
});

export default PillButton;
