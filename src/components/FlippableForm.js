import React from 'react';
import { View, TouchableOpacity, TextInput, Text, Animated, Easing } from 'react-native';
import { Icon } from 'react-native-elements';

import { colors } from '../Styles';

import { SCREEN_WIDTH } from '../Measurements';

class FlippableForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            xFlex: 1,
            yFlex: 0,
            xHeight: 0,
            yHeight: 10,
        }
    }

    componentDidMount() {

    }

    animate() {
        this.xFlex.setValue(1);
        Animated.timing(
            this.xFlex,
            {
                toValue: 0,
                duration: 1000,
                easing: Easing.linear
            }
        ).start(() => this.animate());
    }

    // xbox: when flex is 0, height is 0
    // ybox: when flex is 1, height shouldn't be 0 (you can put null as a value)

    render() {
        return(
            <View style={{flex: 1}}>
                <View style={{
                    width: SCREEN_WIDTH,
                    height: this.state.xFlex == undefined || this.state.xFlex == 1 ? null : 0,
                    flex: this.state.xFlex == undefined || this.state.xFlex == 1 ? 1 : 0,
                    paddingHorizontal: 20,
                    textAlignVertical: 'top'}}>
                    <TextInput
                        multiline
                        style={{fontSize: 16, flex: 1}}
                        placeholder="Meaning of word"
                    />
                </View>
                <View style={{width: SCREEN_WIDTH, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, flex: this.state.asdf == undefined ? 0 : 0.5}}>
                    <TouchableOpacity onPress={() => {
                        if (this.state.xFlex == 1) {
                            this.setState({xFlex: 0, yFlex: 1, iconName: 'downcircleo'})
                        } else {
                            this.setState({xFlex: 1, yFlex: 0, iconName: 'upcircleo'})
                        }
                    }}>
                        <Icon name={this.state.iconName == undefined || this.state.iconName == 'upcircleo' ? 'upcircleo' : 'downcircleo'} type='antdesign' color={colors.default.blue}/>
                    </TouchableOpacity>
                </View>
                <View style={{
                    width: SCREEN_WIDTH,
                    height: this.state.yFlex == undefined || this.state.yFlex == 0 ? 0 : null,
                    flex: this.state.yFlex == undefined || this.state.yFlex == 0 ? 0 : 1,
                    fontSize: 16,
                    paddingHorizontal: 20,
                    textAlignVertical: 'top'}}>
                    <TextInput
                        multiline
                        style={{fontSize: 16, flex: 1}}
                        onFocus={this.props.onFocus}
                        placeholder="Sentence Examples"
                    />
                    <TextInput
                        style={{fontSize: 16, marginVertical: 10}}
                        placeholder="Synonyms"
                    />
                    <TextInput
                        style={{fontSize: 16, marginVertical: 10}}
                        placeholder="Antonyms"
                    />
                </View>
            </View>
        )
    }
}

export default FlippableForm;