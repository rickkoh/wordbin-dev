import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { headerStyles } from '../Styles';
import { withNavigation } from 'react-navigation';

import { colors } from '../Styles';

class Header extends React.Component {

    renderHeader = () => {
        if (this.props.header == null) {
            return(
                <View style={headerStyles.header}>
                    {this.renderHeaderLeft()}
                    {this.renderHeaderTitle()}
                    {this.renderHeaderRight()}
                </View>
            )
        } else {
            return(
                <View>
                    {this.props.header}
                </View>
            )
        }
    }

    renderHeaderLeft = () => {
        if (this.props.headerLeft == null) {
            return(
                null
            )
        } else {
            return(
                <View style={headerStyles.headerLeft}>
                    {this.props.headerLeft}
                </View>
            )
        }
    }

    renderHeaderTitle = () => {
        if (this.props.headerTitle == null) {
            return(
                null
            )
        } else {
            return(
                <View style={headerStyles.headerCenter}>
                    {this.props.headerTitle}
                </View>
            )
        }
    }

    renderHeaderRight = () => {
        if (this.props.headerRight == null) {
            return(
                null
            )
        } else {
            return(
                <View style={headerStyles.headerRight}>
                    {this.props.headerRight}
                </View>
            )
        }
    }

    render() {
        return(
            <View>
                {this.renderHeader()}
            </View>
        )
    }
}

export default withNavigation(Header);
