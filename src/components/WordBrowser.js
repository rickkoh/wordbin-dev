import React from 'react'
import { FlatList } from 'react-native';

import WordCard from './WordCard';

class WordBrowser extends React.Component {
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