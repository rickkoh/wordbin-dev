import React from 'react';
import { View, StyleSheet, TextInput, Text, FlatList } from 'react-native';

import ClearButton from '../ClearButton';

import { SCREEN_WIDTH } from '../../Measurements';

// TODO: Needs revamp

class TagForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: "",
            tag: this.props.data,
        }

        // Props
        // data
        // onChangeText
        // onPress
        // onBlur
        // onFocus
    }

    componentDidUpdate(prevProps, prevState) {
        // onTagDataChanged = {(tag) => //handle tagData}
        if (this.state != prevState) {
            this.props.onTagDataChange ? this.props.onTagDataChange(this.state.tag) : null;
        }
    }

    // Scroll to index function
    scrollToIndex = (index, animated) => {
        this.flatList.scrollToIndex({animated: animated, index: index});
    }

    // Update data function
    updateData = () => {
        this.setState({ tag: this.props.data });
    }

    // Add tag
    addTag = (tag_title) => {
        return new Promise((resolve, reject) => {
            if (tag_title) {
                this.setState({
                    tag: this.state.tag.concat({tag_title: tag_title})
                }, () => {
                    resolve();
                });
            }
        })
    }

    // Remove tag
    removeTag = (index) => {
        tag = this.state.tag;
        tag.splice(index, 1);
        this.setState({tag: tag});
    }

    // Handle tag input text change
    onTagTextInputChange = (text) => {
        // if (text.length > 1 && text.includes(" ")) {
            // this.setState({value: ""});
            // this.addTag(text.split(" ").join(""));
        // } else {
            // // if (!text.includes(" ")) this.setState({value: text});
        // }

        this.props.onTagInputTextChange ? this.props.onTagTextInputChange(text) : null;
    }

    // Handle onKeyPress event
    onKeyPress = (e) => {
        // Add tag if " " is detected
        if (e.nativeEvent.key == ' ') {
            if (this.state.value!= undefined && this.state.value.length >= 1) this.addTag(this.state.value);
            this.setState({value: ""})
        }
    }

    // Handle onChange event
    onChange = (e) => {
        if (e.nativeEvent.text.includes(" ")) this.setState({value: ""});
        else this.setState({value: e.nativeEvent.text});
    }

    // onBlur function
    onBlur = () => {
        // Add tag when blur
        this.addTag(this.state.value);
        this.setState({value: ""});

        this.props.onBlur ? this.props.onBlur() : null;
    }

    // onFocus function
    onFocus = () => {
        this.props.onFocus ? this.props.onFocus() : null;
    }

    // Render function
    render() {
        return(
            <View style={{ maxHeight: 160 }}>
                <TextInput
                    style={styles.textInput}
                    value={this.state.value}
                    placeholder="Tags"
                    onKeyPress={(e) => this.onKeyPress(e)}
                    onChange={(e) => this.onChange(e)}
                    onChangeText={(text) => this.onTagTextInputChange(text)}
                    onBlur={this.onBlur}
                    onFocus={this.onFocus}
                />
                {this._renderTagList()}
            </View>
        )
    }

    _renderTagList = () => {
        return(
            <FlatList
                data={this.state.tag}
                ref={ref => this.flatList = ref}
                contentContainerStyle={styles.tagList}
                renderItem={this._renderTagItem}
                keyExtractor={(item, index) => index.toString()}
                listKey={(item, index) => index.toString()}
            />
        )
    }

    _renderTagItem = ({item, index}) => {
        return(
            <View style={{marginBottom: 10, flexDirection: 'row', justifyContent: 'center'}}>
                <View style={{flexDirection: 'row',  borderRadius: 5, backgroundColor: '#f4f7f8'}}>
                    <Text style={{padding: 5, paddingRight: 0}}>{item.tag_title}</Text>
                    <ClearButton
                        color='lightgray'
                        onPress={() => this.removeTag(index)}
                    />
                </View>
                <TextInput style={{margin: 2, minWidth: 5}}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    textInput: {
        height: 40,
        // paddingHorizontal: 20,
        fontSize: 16,
    },
    tagList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: SCREEN_WIDTH,
    }
})

export default TagForm;