import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

class SideMenu extends React.Component {

    render() {
        // Begin writing here
        return(
            <View>
                <TouchableOpacity onPress={
                    () => console.log('create series here and then upate the event listener/ notify other screens')
                }>
                    <Text>Add Series</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default SideMenu;