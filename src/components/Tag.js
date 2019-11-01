import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../Styles';
import ClearButton from './ClearButton';

class Tag extends React.Component {

    constructor(props) {
        super(props);

        // value
        // isClickable
        // isRectangle
        // hasClearButton
        // onClearButtonPress
    }
    
    render() {
        return(
            <View style={[styles.container, this.props.isRectangle ? {borderRadius: 5} : {borderRadius: 20}, this.props.style]}>
                <Text style={styles.tagText}>{this.props.value}</Text>
                {this.props.hasClearButton ?
                <ClearButton
                    onPress={this.props.onClearButtonPress}
                />
                : null}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 2,
        borderWidth: 1,
        backgroundColor: colors.default.backgroundColor,
        borderColor: colors.default.lightgray
    },
    tagText: {
        padding: 5,
        fontSize: 12
    },
})

export default Tag;