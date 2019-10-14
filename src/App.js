import React from 'react';
import database from './services/Database';

import WordBin from './Router';

export default class App extends React.Component {

    componentDidMount() {
        database.initializeDatabase();
    }

    render() {
        return <WordBin />
    }
}
