import React from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import Modal from 'react-native-modal';

import { colors, SCREEN_WIDTH } from '../../Styles';

class MeaningForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            meaningIndex: 0,
            isModalVisible: false,
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
    }

    scrollToIndex = (index, animated) => {
        // Ensure index is within range
        if (index > -1 && index < this.props.data.length) {
            // Scroll to index
            this.flatList.scrollToIndex({animated: animated, index: index});
        } 
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

    _renderMeaningColumn = ({item, index}) => {
        return(
            <View style={styles.container}>
                <TextInput
                    multiline
                    ref={ref => this[`meaningTextInput${index}`] = ref}
                    hasFocus={false}
                    style={styles.meaningTextInput}
                    placeholder="Meaning of word"
                    value={item.meaning_text}
                    onFocus={this.onMeaningTextFocus}
                    onBlur={this.onMeaningTextBlur}
                    onChangeText={(text) => this.props.onMeaningTextChange(text, index)}
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
                        onChangeText={(text) => this.props.onClassificationTextChange(text, index)}
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

    render() {
        return(
            <FlatList
                ref={(ref) => { this.flatList = ref }}
                keyboardShouldPersistTaps="always"
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