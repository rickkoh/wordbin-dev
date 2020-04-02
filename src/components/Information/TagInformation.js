import React from 'react';
import { View, Text, FlatList, TouchableOpacity, DeviceEventEmitter, StyleSheet } from 'react-native';

import Tag from '../Tag';

// TODO: Revamp this into a component that can be used for synonyms as well

class TagInformation extends React.Component {

    constructor(props) {
        super(props);
    }

    // Render tag header
    _renderHeader = () => {
        return(
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>{this.props.headerText ? this.props.headerText : "Header"}:</Text>
            </View>
        )
    }

    render() {
        if (this.props.data.length >= 1) {
            return(
                <FlatList
                    data={this.props.data}
                    style={styles.tagListContainerStyle}
                    contentContainerStyle={styles.tagListContentContainerStyle}
                    renderItem={this.renderTag} 
                    keyExtractor={(item, index) => index.toString()}
                    listKey={(item, index) => index.toString()}
                />
            )
        } else {
            return(null);
        }
    }

    renderTag = ({item, index}) => {
        if (this.props.header && index == 0) {
            return (
                <View style={styles.tagListContentContainerStyle}>
                    {this._renderHeader()}
                    <TouchableOpacity onPress={() => DeviceEventEmitter.emit("change_title", (item))}>
                        <Tag value={item.tag_title} style={styles.tagItem}/>
                    </TouchableOpacity>
                </View>
            )
        } else {
            return (
                <TouchableOpacity onPress={() => DeviceEventEmitter.emit("change_title", (item))}>
                    <Tag value={item.tag_title} style={styles.tagItem}/>
                </TouchableOpacity>
            )
        }
    }    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    tagListContainerStyle: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tagListContentContainerStyle: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    headerContainer: {
    },
    headerText: {
        fontSize: 12,
        color: 'green',
        marginRight: 5,
        marginBottom: 10,
    },
    tagItem: {
        marginRight: 5,
        marginBottom: 10,
    }
})

export default TagInformation;