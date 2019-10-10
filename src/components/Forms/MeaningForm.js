import React from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';

import { colors } from '../../Styles';
import { SCREEN_WIDTH } from '../../Measurements';

class MeaningForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            meaningIndex: 0,
        }

        // Props
        // meaningValue
        // classificationValue
        // synonymsValue
        // antonymsValue
        // onMeaningChange
        // onClassificationChange
        // onSynonymsChange
        // onAntonymsChange

        // onMeaningIndexChange

        // Todolist
        // O Meaning text input
        // O Classification text input
        // O onMeaningIndexChange
        // X Modal
        // X Synonym values
        // X Antonym values
    }

    scrollToIndex = (index, animated) => {
        // Scroll to index
        if (index > -1 && index < this.props.data.length) {
            this.flatList.scrollToIndex({animated: animated, index: index});
        }
    }

    onViewableItemsChanged = ({ viewableItems }) => {
        // Update index
        this.setState({ meaningIndex: viewableItems[0].index + 1 });
        this.props.onMeaningIndexChange(viewableItems[0].index);
    }

    _renderMeaningColumn = ({item, index}) => {
        return(
            <View style={styles.container}>
                <TextInput
                    multiline
                    style={styles.meaningTextInput}
                    placeholder="Meaning of word"
                    value={item.meaning_text}
                    onFocus={this.props.onMeaningTextFocus}
                    onChangeText={(text) => this.props.onMeaningTextChange(text, index)}
                />
                <View style={styles.rowContainer}>
                    <TextInput
                    style={styles.classificationTextInput}
                    placeholder="Classification"
                    value={item.meaning_classification}
                    onChangeText={(text) => this.props.onClassificationTextChange(text, index)}/>
                    <TouchableOpacity onPress={() => console.log('open modal')}>
                        <Text style={{color: colors.default.blue}}>More options</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    render() {
        return(
            <FlatList
                ref={(ref) => { this.flatList = ref }}
                horizontal
                pagingEnabled
                style={styles.container}
                showsHorizontalScrollIndicator={false}
                data={this.props.data}
                renderItem={this._renderMeaningColumn}
                onViewableItemsChanged={this.onViewableItemsChanged}
                keyExtractor={(item, index) => index.toString()}
                listKey={(item, index) => index.toString()}
            />
        )
    }
}

export default MeaningForm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginVertical: 10,
    },
    meaningTextInput: {
        flex: 1,
        width: SCREEN_WIDTH,
        paddingHorizontal: 20,
        textAlignVertical: 'top',
        fontSize: 16,
    },
    classificationTextInput: {
        flex: 1,
        marginRight: 20,
        fontSize: 16,
    }
})