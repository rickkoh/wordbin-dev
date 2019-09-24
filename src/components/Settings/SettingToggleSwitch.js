import React from 'react';
import { View, StyleSheet, Text, Switch } from 'react-native';
import { colors } from '../../Styles';

class SettingToggleSwitch extends React.Component {
    constructor(props) {
        super(props);

        // Props
        // Title
        // When On = run a function
        // When Off = run a function
        // Default
        
        this.state = {
            switchValue: true
        }
    }

    toggleSwitch = (value) => {
        // Do something here
        this.setState({ switchValue: value });
    }

    render() {
        return(
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{this.props.title}</Text>
                </View>
                <Switch
                    onValueChange={this.toggleSwitch}
                    value={this.state.switchValue}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 50,
        paddingHorizontal: 20,
        borderTopWidth: 0,
        borderBottomWidth: 1,
        borderColor: colors.default.lightgray,
    },
    titleContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
    }
});

export default SettingToggleSwitch;