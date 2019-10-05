import React from 'react'
import { FlatList } from 'react-native';

import WordCard from './WordCard';

class WordBrowser extends React.Component {
    // Collects data
    // And then displays the data in the list form
    render() {
        return(
            <FlatList
                data={this.props.data}
                contentContainerStyle={{justifyContent: 'center'}}
                renderItem={({item}) => <WordCard word={item}/>}
                keyExtractor={(item, index) => index.toString()}
            />
        )
    }
}

export default WordBrowser;