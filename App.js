import React from 'react';
import database from './src/services/Database';

import WordBin from './src/Router';

export default class App extends React.Component {

    componentDidMount() {
        database.initializeDatabase();
    }

    render() {
        return <WordBin />
    }
}
