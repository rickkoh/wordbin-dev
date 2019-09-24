import React from 'react';
import { View, TouchableOpacity, Text  } from 'react-native';
import { withNavigation } from 'react-navigation';

class TextButton extends React.Component {

    textButtonStyle = function() {
        if (this.props.style != undefined) {
            return({

            }
            )
        }
    }

    render() {
        return (
            <View>
                <TouchableOpacity
                    onPress{() => this.props.onPress}
                    style={}
            </View>
        )
    }

}

export default withNavigation(TextButton);
