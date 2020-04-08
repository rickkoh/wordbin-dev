import React from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import Modal from 'react-native-modal';

import { colors, SCREEN_WIDTH } from '../../Styles';

class MeaningForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            meaning: JSON.parse(JSON.stringify(this.props.data)),
            meaningIndex: 0,
            isModalVisible: false,
        }

        this.itemWidth;
        this.itemPaddingRight = 20;

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
    }

    componentDidUpdate(prevProps, prevState) {
        // onMeaningDataChanged = {(meaning) => //handle meaningData}
        if (this.state.meaning != prevState.meaning) {
            this.props.onMeaningDataChange ? this.props.onMeaningDataChange(this.state.meaning) : null;
        }
    }

    // Scroll to index function
    scrollToIndex = (index, animated) => {
        // Ensure index is within range
        if (index > -1 && index < this.state.meaning.length) {
            // Scroll to index
            this.flatList.scrollToIndex({animated: animated, index: index});
        } 
    }

    // Update data function
    updateData = () => {
        this.setState({meaning: JSON.parse(JSON.stringify(this.props.data))});
    }

    onViewableItemsChanged = ({ viewableItems }) => {
        // Update index changed
        this.setState({ meaningIndex: viewableItems[0].index });
        this.props.onMeaningIndexChange(viewableItems[0].index);

        // Autofocus
        if (this.props.autofocus && viewableItems.length <= 1) {
            // MeaningTextInput
            if (this.meaningHasFocus) this[`meaningTextInput${viewableItems[0].index}`].focus();
            // ClassificationTextInput
            else if (this.classificationHasFocus) this[`classificationTextInput${viewableItems[0].index}`].focus();            
        }
    }

    onMeaningTextFocus = () => {
        this.props.onMeaningTextFocus ? this.props.onMeaningTextFocus() : null;
        this.meaningHasFocus = true;
    }

    onMeaningTextBlur = () => {
        this.props.onMeaningTextBlur ? this.props.onMeaningTextBlur() : null;
        this.meaningHasFocus = false;
    }

    onClassificationTextFocus = () => {
        this.props.onClassificationTextFocus ? this.props.onClassificationTextFocus() : null;
        this.classificationHasFocus = true;
    }

    onClassificationTextBlur = () => {
        this.props.onClassificationTextBlur ? this.props.onClassificationTextBlur() : null;
        this.classificationHasFocus = false;
    }

    onMeaningTextChange = (text, index) => {
        meaning = this.state.meaning;
        meaning[index].meaning_text = text;

        if (index == meaning.length-1) {
            if (meaning[index].meaning_text != "" && meaning[index].meaning_text != undefined) {
                meaning = meaning.concat({meaning_id: undefined, meaning_text: undefined, meaning_classification: undefined, meaning_datetimecreated: undefined});
            }
        } else {
            // Fix: This method implemented causes confusion in the user as the user keeps backspacing
            if (meaning[index].meaning_text == "" || meaning[index].meaning_text == undefined) {
                meaning.splice(index, 1);
            }
        }

        this.setState({meaning: JSON.parse(JSON.stringify(meaning))});
        this.props.onMeaningTextChange ? this.props.onMeaningTextChange(text, index) : null;
    }

    onClassificationTextChange = (text, index) => {
        meaning = this.state.meaning;
        meaning[index].meaning_classification = text;
        this.setState({ meaning: meaning });
        this.props.onClassificationTextChange ? this.props.onClassificationTextChange(text, index) : null;
    }

    render() {
        return(
            <View style={styles.container} onLayout={(event) => {
                // Retrieve width value so as to adjust the item column width
                var {_, _, width, _} = event.nativeEvent.layout;
                this.itemWidth = width;
            }}>
            <FlatList
                ref={(ref) => { this.flatList = ref }}
                keyboardShouldPersistTaps="always"
                horizontal
                pagingEnabled
                style={styles.container}
                showsHorizontalScrollIndicator={false}
                data={this.state.meaning}
                renderItem={this._renderMeaningColumn}
                onViewableItemsChanged={this.onViewableItemsChanged}
                keyExtractor={(item, index) => index.toString()}
                listKey={(item, index) => index.toString()}
            />
            </View>
        )
    }

    _renderMeaningColumn = ({item, index}) => {
        return(
            <View style={[styles.container, {paddingRight: this.itemPaddingRight}]}>
                <TextInput
                    multiline
                    ref={ref => this[`meaningTextInput${index}`] = ref}
                    hasFocus={false}
                    style={[styles.meaningTextInput, {width: this.itemWidth ? this.itemWidth-this.itemPaddingRight : null}]}
                    placeholder="Meaning of word"
                    value={item.meaning_text}
                    onFocus={this.onMeaningTextFocus}
                    onBlur={this.onMeaningTextBlur}
                    onChangeText={(text) => this.onMeaningTextChange(text, index)}
                />
                <View style={styles.rowContainer}>
                    <TextInput
                        ref={ref => this[`classificationTextInput${index}`] = ref}
                        blurOnSubmit={false}
                        style={styles.classificationTextInput}
                        placeholder="Classification"
                        value={item.meaning_classification}
                        onFocus={this.onClassificationTextFocus}
                        onBlur={this.onClassificationTextBlur}
                        onChangeText={(text) => this.onClassificationTextChange(text, index)}
                    />
                    <TouchableOpacity onPress={() => this.props.toggleVisibility()}>
                        <Text style={{color: colors.default.blue}}>More options</Text>
                    </TouchableOpacity>
                </View>

                <Modal>

                </Modal>
            </View>
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
        marginVertical: 10,
    },
    meaningTextInput: {
        flex: 1,
        // Width is dynamic
        textAlignVertical: 'top',
        fontSize: 16,
    },
    classificationTextInput: {
        flex: 1,
        marginRight: 20,
        fontSize: 16,
    }
})