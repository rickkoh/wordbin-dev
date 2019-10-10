import React from 'react';
import { View, StyleSheet, TextInput, Text, FlatList } from 'react-native';

import ClearButton from '../ClearButton';

import { SCREEN_WIDTH } from '../../Measurements';

class TagForm extends React.Component {
    constructor(props) {
        super(props);
        
        // Available props
        // Tags 
    }

    scrollToIndex = (index, animated) => {
        this.flatList.scrollToIndex({animated: animated, index: index});
    }

    renderTagList = () => {
        // Starts with tag_title: undefined
        data = [...this.props.data];
        data.splice(data.length-1);
        return(
            <FlatList
                data={data}
                ref={(ref) => this.flatList = ref}
                contentContainerStyle={{paddingHorizontal: 20, flexDirection: 'row', flexWrap: 'wrap', width: SCREEN_WIDTH}}
                renderItem={this.renderTagItem}
                keyExtractor={(item, index) => index.toString()}
                listKey={(item, index) => index.toString()}
            />
        )
    }

    renderTagItem = ({item, index}) => {
        return(
            <View style={{marginBottom: 10, flexDirection: 'row', justifyContent: 'center'}}>
                <View style={{flexDirection: 'row',  borderRadius: 5, backgroundColor: '#f4f7f8'}}>
                    <Text style={{padding: 5, paddingRight: 0}}>{item.tag_title}</Text>
                    <ClearButton
                        color='lightgray'
                        onPress={() => this.props.onPress(index)}
                    />
                </View>
                <TextInput style={{margin: 2, minWidth: 5}}/>
            </View>
        )
    }

    render() {
        return(
            <View style={{ maxHeight: 160 }}>
                <TextInput
                    style={styles.textInput}
                    value={this.props.value}
                    placeholder="Tags"
                    onChangeText={(text) => this.props.onChangeText(text)}
                    onBlur={this.props.onBlur}
                    onFocus={this.props.onFocus}
                />
                {this.renderTagList()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    textInput: {
        height: 40,
        paddingHorizontal: 20,
        fontSize: 16,
    }
})

export default TagForm;