import React from 'react';
import { View, Text } from 'react-native';

import PillButton from '../PillButton';

class SideMenu extends React.Component {

    render() {
        return(
            <View style={{paddingHorizontal: 15}}>
                <PillButton
                    text="Add Series"
                    onPress={() => console.log("Hi!")}
                />
            </View>
        )
    }
}

export default SideMenu;