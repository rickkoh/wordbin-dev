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
import MeaningSentence from '../models/MeaningSentence';
import { DeviceEventEmitter } from 'react-native';

const DATABASE_NAME = 'db.db';

// TODO: Devise a proper naming convention for the database functions

db = SQLite.openDatabase(DATABASE_NAME);

class Database {

    // Connect to the database
    // Ensure that database file is created
    initializeDatabase() {
        FileSystem.getInfoAsync(FileSystem.documentDirectory + "SQLite/" + DATABASE_NAME).then(file => {
            if (!file.exists) {
                this.createDatabase();
                console.log('Database intialized');
                DeviceEventEmitter.emit("database_changed");
            }
        });
    }

    // Create the database
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

        db.transaction(tx => {
            tx.executeSql(MeaningSentence.Query.CREATE_MEANINGSENTENCE_TABLE);
        }, error => {
            console.log(error);
        })

        console.log("Database created.");
    }

    // Delete the database
    deleteDatabase() {
        FileSystem.deleteAsync(FileSystem.documentDirectory + "SQLite/" + DATABASE_NAME);
        console.log("Database deleted.");
    }

    // Reset the database
    resetDatabase() {
        this.deleteDatabase();
        this.createDatabase();
        console.log("Database resetted.");
    }

    // Add word to the database
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

    // Delete a word from the database
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

    // Add meaning(s) to the word object
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

    // Delete all the meaning from the word object
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

    // Add a series to the database
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

    // Add a word series to the database
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

    // Add a sentence example to the meaning object
    addMeaningSentence(meaning_id, meaningsentence) {
        return new Promise((resolve, reject) => {
            meaningsentence_id = undefined;
            db.transaction(tx => {
                tx.executeSql(
                    MeaningSentence.Query.INSERT_MEANINGSENTENCE_QUERY,
                    [meaning_id, meaningsentence.meaningsentence_text],
                    (_, { insertId }) => meaningsentence_id = insertId
                );
            }, error => {
                reject(error);
            }, success => {
                resolve(meaningsentence_id);
            })
        })
    }

    // Add a tag to the database
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

    // Link the tag to a word object
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

    // Get all the words from the database
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

    // Get a word from the database
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

    // Get all the words based on the tag from the database
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

    // Get all the meanings of the word object
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

    // Get all the sentence examples of the meaning object
    getMeaningSentence(meaning_id) {
        return new Promise((resolve, reject) => {
            result = undefined;
            db.transaction(tx => {
                tx.executeSql(
                    meaningnSen .Query.SELECT_ALL_MEANINGSENTENCE_QUERY,
                    [meaning_id],
                    (_, {rows: { _array } }) => result = _array
                );
            }, error => {
                reject(error);
            }, success => {
                resolve(result);
            })
        })
    }

    // Get all the series from the database
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

    // Get all the tags from the database based on the tag title
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

    // Get all the tags from the database
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

    // Get all the words in the series
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

    // Get all the series the word belongs to
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

    // Get all the tags of the word
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

    // Get all the words that have the tag
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

    // Get all the word synonym
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

    // Update word text
    updateWord(word_id, word_text) {
        return new Promise((resolve, reject) => {
            noRowsAffected = undefined;
            db.transaction(tx => {
                tx.executeSql(
                    Word.Query.UPDATE_WORD_QUERY,
                    [word_text, word_id],
                    (_, { rowsAffected }) => noRowsAffected = rowsAffected
                );
            }, error => {
                reject(error);
            }, success => {
                resolve(noRowsAffected);
            });
        })
    }

    // Update meaning text
    updateMeaningText(meaning_id, meaning_text) {
        return new Promise((resolve, reject) => {
            noRowsAffected = undefined;
            db.transaction(tx => {
                tx.executeSql(
                    Meaning.Query.UPDATE_MEANING_TEXT_QUERY,
                    [meaning_text, meaning_id],
                    (_, { rowsAffected }) => noRowsAffected = rowsAffected
                );
            }, error => {
                reject(error);
            }, success => {
                resolve(noRowsAffected);
            });
        })
    }

    // Update meaning classification
    updateMeaningClassification(meaning_id, meaning_classification) {
        return new Promise((resolve, reject) => {
            noRowsAffected = undefined;
            db.transaction(tx => {
                tx.executeSql(
                    Meaning.Query.UPDATE_MEANING_CLASSIFICATION_QUERY,
                    [meaning_classification, meaning_id],
                    (_, { rowsAffected }) => noRowsAffected = rowsAffected
                );
            }, error => {
                reject(error);
            }, success => {
                resolve(noRowsAffected);
            });
        })
    }
    
    // Print the database location
    printDatabaseLocation() {
        console.log(FileSystem.documentDirectory + "SQLite/" + DATABASE_NAME);
    }

}

const database = new Database();

export default database;