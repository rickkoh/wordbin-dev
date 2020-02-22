import React from 'react';
import ActionButton from 'react-native-action-button';
import { withNavigation } from 'react-navigation';

import { colors } from '../Styles';

class AddActionButton extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ActionButton
                buttonColor={colors.default.blue}
                onPress={this.props.onPress}
            />
        )
    }
}

export default withNavigation(AddActionButton);
