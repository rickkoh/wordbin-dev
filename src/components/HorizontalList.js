import React from 'react';
import { ScrollView, FlatList } from 'react-native';

class HorizontalList extends React.Component {
    render() {
        return (
            <ScrollView horizontal style={{flexDirection: 'row'}}>
                <FlatList
                    style={{flexDirection: 'row', flexWrap: 'wrap'}}
                    data={this.props.data}
                    renderItem={this.props.renderItem}
                />
            </ScrollView>
        )
    }
}

export default HorizontalList;