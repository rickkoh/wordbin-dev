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
                <Text style={styles.headerText}>Tags:</Text>
            </View>
        )
    }

    render() {
        if (this.props.data.length >= 1) {
            return(
                <View style={styles.container}>
                    {
                        // Header
                        this.props.header ? this._renderHeader() : null
                    }
                    <FlatList
                        data={this.props.data}
                        style={styles.tagListContainer}
                        renderItem={this.renderTag} 
                        keyExtractor={(item, index) => index.toString()}
                        listKey={(item, index) => index.toString()}
                    />
                </View>
            )
        } else {
            return(null);
        }
    }

    renderTag = ({item, index}) => {
        return (
            <TouchableOpacity onPress={() => DeviceEventEmitter.emit("change_title", (item))}>
                <Tag value={item.tag_title} style={styles.tagItem}/>
            </TouchableOpacity>
        )
    }    
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tagListContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    headerContainer: {
        marginRight: 5,
        marginBottom: 10,
    },
    headerText: {
        fontSize: 12,
        color: 'green',
    },
    tagItem: {
        marginRight: 5,
        marginBottom: 10,
    }
})

export default TagInformation;