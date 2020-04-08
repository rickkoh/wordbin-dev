import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

class HorizontalList extends React.Component {

    constructor(props) {
        super(props);

        // data
        // renderItem
        // onLinkItemPress
    }

    render() {
        if (this.props.data.length > 0) {
            return (
                <View style={[styles.container, this.props.containerStyle]}>
                    {
                        // Header
                        this.props.header || this.props.headerText ? 
                        <View style={[this.props.headerStyle]}>
                            <Text style={[this.props.headerTextStyle]}>{this.props.headerText ? this.props.headerText : "Header"}: </Text>
                        </View>
                        : null
                    }
                    {this.props.data.map((item, index) => {
                        return(
                            <View>
                                {this.props.renderItem(item, index)}
                            </View>
                        )
                    })}
                </View>
            )
        } else {
            return(null);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    }
})

export default HorizontalList;