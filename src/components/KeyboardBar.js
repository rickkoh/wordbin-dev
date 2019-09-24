import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

class KeyboardBar extends React.Component {

    constructor(props) {
        super(props);

        // Buttons
        // Stored in array
        //
        // Use arrays to separate the buttons and make them look normal on the thing that
        //
        // [button1, button2, button 3]
        // [section1, section2, section 3]
        // [button1, [button2, button3], button4]
    }

    renderSection = () => {
        renderContent = this.props.renderContent;
        return createSection(renderContent);
    }

    createSection = (renderContent, position) => {
        // If you render container you cannot render content
        if (node.content) {
            aggregatedContent = undefined;
            for (int i = 0; i < content.length; i++) {
                aggregatedContent += content[i];
            }
            return aggregatedContent;
        } else {
            // Remove the rendered item here
            if (node.container == undefined) {
                return(
                    <View style={styles.section}>
                        {createSection(node, position+1)}
                    </View>
                )
            } else if (node.container == 'left') {
                return(
                    <View style={styles.section-left}>
                        {createSection(node, position+1)}
                    </View>
                )
            } else if (node.container == 'center') {
                return(
                    <View style={styles.section-center}>
                    </View>
                )
            } else if (node.container == 'right') {
                return(
                    <View style={styles.section-right}>
                        {createSection(node, position+1)}
                    </View>
                )
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
            </View>
        )
    }

}

styles = StylSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#f4f7f8',
        height: 50,
        paddingHorizontal: 20,
    },
    section: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    section-left: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    section-center: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    section-right: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
})
