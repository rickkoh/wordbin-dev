// Import modules
import { SQLite } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

// Import models
import Word from '../models/Word';
import Meaning from '../models/Meaning';
import Series from '../models/Series';
import Tag from '../models/Tag';
import WordSeries from '../models/WordSeries';
import WordTag from '../models/WordTag';
import WordSynonym from '../models/WordSynonym';
import { DeviceEventEmitter } from 'react-native';

const DATABASE_NAME = 'db.db';

// TODO: Devise a proper naming convention for the database functions

db = SQLite.openDatabase(DATABASE_NAME);

class Database {

    initializeDatabase() {
        FileSystem.getInfoAsync(FileSystem.documentDirectory + "SQLite/" + DATABASE_NAME).then(file => {
            if (file.exists == false) {
                this.createDatabase();
                console.log('Database intialized');
                DeviceEventEmitter.emit("database_changed");
            }
        });
    }

    createDatabase() {
        db.transaction(tx => {
            tx.executeSql(Word.Query.CREATE_WORD_TABLE);
        }, error => {
            console.log(error);
        });

        db.transaction(tx => {
            tx.executeSql(Meaning.Query.CREATE_MEANING_TABLE);
        }, error => {
            console.log(error);
        });

        db.transaction(tx => {
            tx.executeSql(Series.Query.CREATE_SERIES_TABLE);
        }, error => {
            console.log(error);
        });

        db.transaction(tx => {
            tx.executeSql(Tag.Query.CREATE_TAG_TABLE);
        }, error => {
            console.log(error);
        });

        db.transaction(tx => {
            tx.executeSql(WordSeries.Query.CREATE_WORDSERIES_TABLE);
        }, error => {
            console.log(error);
        });

        db.transaction(tx => {
            tx.executeSql(WordTag.Query.CREATE_WORDTAG_TABLE);
        }, error => {
            console.log(error);
        });

        db.transaction(tx => {
            tx.executeSql(WordSynonym.Query.CREATE_WORDSYNONYM_TABLE);
        }, error => {
            console.log(error);
        });

        console.log("Database created.");
    }

    deleteDatabase() {
        FileSystem.deleteAsync(FileSystem.documentDirectory + "SQLite/" + DATABASE_NAME);
        console.log("Database deleted.");
    }

    resetDatabase() {
        this.deleteDatabase();
        this.createDatabase();
        console.log("Database resetted.");
    }

    addWord(word) {
        return new Promise((resolve, reject) => {
            word_id = undefined;
            db.transaction(tx => {
                tx.executeSql(
                    Word.Query.INSERT_WORD_QUERY,
                    [word.word_text, word.word_pronunciation, word.word_origin],
                    (_, { insertId }) => word_id = insertId
                );
            }, error => {
                reject(error);
            }, success => {
                resolve(word_id);
            });
        })
    }

    deleteWord(word_id) {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    Word.Query.DELETE_WORD_QUERY,
                    [word_id],
                    (null)
                )
            }, error => {
                reject(error);
            }, success => {
                // Code can run synchronously
                this.deleteMeaningByWordId(word_id);
                resolve(true);
            });
        })
    }

    addMeaning(meaning) {
        return new Promise((resolve, reject) => {
            meaning_id = undefined;
            db.transaction(tx => {
                tx.executeSql(
                    Meaning.Query.INSERT_MEANING_QUERY,
                    [meaning.meaning_word_id, meaning.meaning_text, meaning.meaning_classification],
                    (_, { insertId }) => meaning_id = insertId
                );
            }, error => {
                reject(error);
            }, success => {
                resolve(meaning_id);
            });
        })
    }

    deleteMeaningByWordId(word_id) {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    Meaning.Query.DELETE_MEANING_BY_WORD_ID_QUERY,
                    [word_id],
                    (null)
                )
            }, error => {
                reject(error);
            }, success => {
                resolve(result);
            });
        })
    }

    addSeries(series_title) {
        return new Promise((resolve, reject) => {
            series_id = undefined;
            db.transaction(tx => {
                tx.executeSql(
                    Series.Query.INSERT_SERIES_QUERY,
                    [series_title],
                    (_, { insertId }) => series_id = insertId
                );
            }, error => {
                reject(error);
            }, success => {
                resolve(series_id);
            });
        })
    }

    addWordSeries(word_id, series_id) {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    WordSeries.Query.INSERT_WORDSERIES_QUERY,
                    [word_id, series_id],
                    (null)
                )
            }, error => {
                reject(error);
            }, success => {
                resolve(true);
            })
        })
    }

    addTag(tag) {
        return new Promise((resolve, reject) => {
            tag_id = undefined;
            db.transaction(tx => {
                tx.executeSql(
                    Tag.Query.INSERT_TAG_QUERY,
                    [tag.tag_title],
                    (_, { insertId }) => tag_id = insertId
                );
            }, error => {
                reject(error);
            }, success => {
                resolve(tag_id);
            })
        })
    }

    addWordTag(word_id, tag_id) {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    WordTag.Query.INSERT_WORDTAG_QUERY,
                    [word_id, tag_id],
                    (null)
                );
            }, error => {
                reject(error);
            }, success => {
                resolve(true);
            })
        })
    }

    getWords() {
        return new Promise((resolve, reject) => {
            result = undefined;
            db.transaction(tx => {
                tx.executeSql(
                    Word.Query.SELECT_ALL_WORD_QUERY_ORDERBY_LATEST,
                    [],
                    (_, {rows: { _array } }) => result = _array 
                );
            }, error => {
                reject(error);
            }, success => {
                resolve(result);
            });
        })
    }

    getWord(word_id) {
        return new Promise((resolve, reject) => {
            result = undefined;
            db.transaction(tx => {
                tx.executeSql(
                    Word.Query.SELECT_WORD_BY_ID_QUERY,
                    [word_id],
                    (_, {rows: { _array } }) => result = _array 
                );
            }, error => {
                reject(error);
            }, success => {
                resolve(result);
            });
        })
    }

    getWordsByTags(tag_id) {
        return new Promise((resolve, reject) => {
            result = undefined;
            db.transaction(tx => {
                tx.executeSql(
                    WordTag.Query.SELECT_ALL_TAGWORD_ORDERBY_LATEST_QUERY,
                    [tag_id],
                    (_, {rows: { _array } }) => result = _array
                )
            }, error => {
                reject(error);
            }, success => {
                resolve(result);
            });
        })
    }

    getMeanings(word_id) {
        return new Promise((resolve, reject) => {
            result = undefined;
            db.transaction(tx => {
                tx.executeSql(
                    Meaning.Query.SELECT_ALL_MEANING_QUERY,
                    [word_id],
                    (_, {rows: { _array } }) => result = _array 
                );
            }, error => {
                reject(error);
            }, success => {
                resolve(result);
            });
        })
    }

    getSeries() {
        return new Promise((resolve, reject) => {
            result = undefined;
            db.transaction(tx => {
                tx.executeSql(
                    Series.Query.SELECT_ALL_SERIES_QUERY,
                    [],
                    (_, {rows: { _array } }) => result = _array 
                );
            }, error => {
                reject(error);
            }, success => {
                resolve(result);
            });
        })
    }

    getTag(tag_title) {
        return new Promise((resolve, reject) => {
            result = undefined;
            db.transaction(tx => {
                tx.executeSql(
                    Tag.Query.SELECT_TAGS_QUERY,
                    [tag_title],
                    (_, {rows: { _array } }) => result = _array
                )
            }, error => {
                reject(error);
            }, success => {
                resolve(result);
            });
        })
    }

    getTags() {
        return new Promise((resolve, reject) => {
            result = undefined;
            db.transaction(tx => {
                tx.executeSql(
                    Tag.Query.SELECT_ALL_TAGS_QUERY,
                    [],
                    (_, {rows: { _array } }) => result = _array 
                );
            }, error => {
                reject(error);
            }, success => {
                resolve(result);
            });
        })
    }

    getSeriesWords(series_id) {
        return new Promise((resolve, reject) => {
            result = undefined;
            db.transaction(tx => {
                tx.executeSql(
                    WordSeries.Query.SELECT_ALL_SERIESWORD_QUERY,
                    [series_id],
                    (_, {rows: { _array } }) => result = _array
                )
            }, error => {
                reject(error);
            }, success => {
                resolve(result);
            });
        })
    }

    getWordSeries(word_id) {
        return new Promise((resolve, reject) => {
            result = undefined;
            db.transaction(tx => {
                tx.executeSql(
                    WordSeries.Query.SELECT_ALL_WORDSERIES_QUERY,
                    [word_id],
                    (_, {rows: { _array } }) => result = _array
                )
            }, error => {
                reject(error);
            }, success => {
                resolve(result);
            });
        })
    }

    getWordTags(word_id) {
        return new Promise((resolve, reject) => {
            result = undefined;
            db.transaction(tx => {
                tx.executeSql(
                    WordTag.Query.SELECT_ALL_WORDTAG_QUERY,
                    [word_id],
                    (_, {rows: { _array } }) => result = _array
                )
            }, error => {
                reject(error)
            }, success => {
                resolve(result);
            })
        })
    }

    getTagWords(tag_id) {
        return new Promise((resolve, reject) => {
            result = undefined;
            db.transaction(tx => {
                tx.executeSql(
                    WordTag.Query.SELECT_ALL_WORDTAG_QUERY,
                    [tag_id],
                    (_, {rows: { _array } }) => result = _array
                )
            }, error => {
                reject(error);
            }, success => {
                resolve(result);
            })
        })
    }

    getWordSynonym(meaning_id) {
        return new Promise((resolve, reject) => {
            result = undefined;
            db.transaction(tx => {
                tx.executeSql(
                    WordSynonym.Query.SELECT_ALL_WORDSYNONYM_QUERY,
                    [meaning_id],
                    (_, {rows: { _array } }) => result = _array
                )
            }, error => {
                reject(error);
            }, success => {
                resolve(result);
            });
        })
    }

    printDatabaseLocation() {
        console.log(FileSystem.documentDirectory + "SQLite/" + DATABASE_NAME);
    }

}

const database = new Database();

export default database;