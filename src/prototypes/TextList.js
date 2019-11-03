import React from 'react';
import { View, StyleSheet, FlatList, TextInput, Text } from 'react-native';

import Tag from '../components/Tag';

import { SCREEN_WIDTH } from '../Measurements';

// Maybe make this prop to display only tags but not add tags(?)
class TextList extends React.Component {
    constructor(props) {
        super(props);

        // editable
        // hasHeader
        // headerText
        // headerStyle
        // hasDeleteButton
        // deleteButtonStyle
        // onArrayItemsChange returns (newArray)
        // tagIsRectangle
        // tagStyle

        this.state = {
            text: [
                "",
                "",
                "",
                ""
            ],
            data: [
                "item1",
                "item2",
                "item3",
                "item4"
            ]
        }
    }

    scrollToIndex(index, animated) {
        this.flatList.scrollToIndex({animated: animated, index: index});
    }

    handleTextChange = (text, index) => {
        // When a space bar is detected, you wanna add an item to the next index
        // If item is the last then just add the item to the back of the list

        if (text[text.length-1] == " ") {
            this.state.text[index] = "";
            this.state.data.splice(index+1, 0, text)
            this.setState({data: this.state.data})
        } else {
            this.state.text[index] = text;
        }

        this.setState({text: this.state.text})

    }

    _renderItemList() {
        return(
            <FlatList
                style={{height: 40, flex: 1, backgroundColor: 'pink'}}
                ref={ref => this.flatList = ref}
                data={this.state.data}
                ListHeaderComponent={this._renderListHeader.bind(this)}
                renderItem={this._renderListItem.bind(this)}
                contentContainerStyle={styles.listContainerStyle}
            />
        )
    }

    _renderListHeader() {
        if (this.props.hasHeader) {
            return(<Text style={[styles.headerStyle, this.props.headerStyle]}>{this.props.headerText == undefined ? "Header" : this.props.headerText}: </Text>)
        } else {
            return(null)
        }
    }

    _renderListItem({item, index}) {
        return(
            <View style={styles.listItemStyle}>
                <Tag value={item} style={[styles.tagStyle, this.props.tagStyle]}/>
                <TextInput
                    value={this.state.text[index]}
                    multiline
                    onChangeText={(text) => this.handleTextChange(text, index)}
                />
            </View>
        )
    }

    onArrayItemsChange = (callback) => {
        // return item and index
    }

    render() {
        return(
            <View style={styles.container}>
                {this._renderItemList()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minHeight: 1600,
    },
    headerStyle: {
    },
    tagStyle: {
    },
    listContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        width: SCREEN_WIDTH,
        paddingHorizontal: 20,
    },
    listItemStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    textInput: {
        height: 40,
        paddingHorizontal: 20,
        fontSize: 16
    }
})

export default TextList;