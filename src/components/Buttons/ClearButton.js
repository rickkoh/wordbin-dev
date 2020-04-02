import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { colors } from '../../Styles';

class ClearButton extends React.Component {

    render() {
        return(
            <TouchableOpacity
                onPress={this.props.onPress}
                style={[styles.clearButton, this.props.style]}>
                <Icon name='cancel' size={16} color={this.props.color == undefined ? colors.default.primaryColor : this.props.color}/>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    clearButton:{
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    }
});

export default ClearButton;
