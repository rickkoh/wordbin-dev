import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import Modal from 'react-native-modal';
import { WebView } from 'react-native-webview';

import { STATUS_BAR_HEIGHT, colors } from '../Styles';

class WordBrowser extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isVisible: true
        }
    }

    onCloseButtonPress = () => {
        try {
            this.props.onCloseButtonPress();
        } catch { }
    }

    render() {
        return(
            <Modal
                isVisible={this.props.isVisible}
                style={styles.modal}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.headerButton} onPress={this.onCloseButtonPress}>
                            <Icon name='close' type='evilicon' size='30'/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerButton} onPress={this.onCloseButtonPress}>
                            <Icon name='ellipsis1' type='antdesign' size='30'/>
                        </TouchableOpacity>
                    </View>
                    <WebView
                        source={{uri: "https://www.google.com/search?q=define "+this.props.word.toLowerCase()}}
                    />
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        margin: 0
    },
    container: {
        flex: 1
    },
    header: {
        paddingTop: STATUS_BAR_HEIGHT,
        height: STATUS_BAR_HEIGHT+40,
        backgroundColor: colors.default.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerButton: {
        paddingHorizontal: 15
    }
})

export default WordBrowser;