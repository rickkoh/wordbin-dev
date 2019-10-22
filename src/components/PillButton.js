import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../Styles';

class PillButton extends React.Component {

    render() {
        return(
            <View style={(this.props.enabled || this.props.enabled == undefined) ? styles.enabled : styles.disabled}>
                <TouchableOpacity
                    onPress={(this.props.enabled || this.props.enabled == undefined) ? this.props.onPress : null}
                    style={[styles.defaultPillButtonStyle, this.props.style]}>
                    <Text numberOfLines={1} style={{color: 'white', fontSize: 16}}>{this.props.text}</Text>
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
    enabled: {
        opacity: 1,
    },
    disabled: {
        opacity: 0.25,
    },
});

export default PillButton;
