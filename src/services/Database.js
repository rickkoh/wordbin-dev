// Import modules
import { SQLite } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { normalize, schema } from 'normalizr'; 

// Import models
import Word from '../models/Word';
import Meaning from '../models/Meaning';
import Series from '../models/Series';
import Tag from '../models/Tag';
import WordSeries from '../models/WordSeries';
import WordTag from '../models/WordTag';
import WordSynonym from '../models/WordSynonym';

const DATABASE_NAME = 'db.db';

db = SQLite.openDatabase(DATABASE_NAME);

// TODO: Convert all functions to use Promises (Functions are currently using callbacks)

class Database {

    initializeDatabase = () => {
        FileSystem.getInfoAsync(FileSystem.documentDirectory + "SQLite/" + DATABASE_NAME).then(file => {
            if (file.exists == false) {
                this.createDatabase();
                console.log('Database intialized');
            }
        });
    }

    createDatabase = () => {
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

    deleteDatabase = () => {
        FileSystem.deleteAsync(FileSystem.documentDirectory + "SQLite/" + DATABASE_NAME);
        console.log("Database deleted.");
    }

    resetDatabase = () => {
        this.deleteDatabase();
        this.createDatabase();
        console.log("Database resetted.");
    }

    addWord = (word, error_callback, success_callback) => {
        word_id = undefined;
        db.transaction(tx => {
            tx.executeSql(
                Word.Query.INSERT_WORD_QUERY,
                [word.word_text, word.word_pronunciation, word.word_origin],
                (_, { insertId }) => word_id = insertId
            );
        }, error => {
            try {
                error_callback(error);
            } catch (error) {
                console.log(error);
            }
        }, success => {
            try {
                success_callback(word_id);
            } catch (error) {
                console.log(error);
            }
        });
    }

    deleteWord = (word_id, error_callback, success_callback) => {
        db.transaction(tx => {
            tx.executeSql(
                Word.Query.DELETE_WORD_QUERY,
                [word_id],
                (null)
            )
        }, error => {
            try {
                error_callback(error);
            } catch (error) {
                console.log(error);
            }
        }, success => {
            try {
                this.deleteMeaningByWordId(word_id);
                success_callback(true);
            } catch (error) {
                console.log(error);
            }
        });
    }

    addMeanings = (word_id, meaning_array, error_callback, success_callback) => {
        if (meaning_array.length > 0) {
            meaning_array.forEach(async (meaning) => {
                this.addMeaning(word_id, meaning, error_callback, success_callback);
            });
        }
    }

    addMeaning = (word_id, meaning, error_callback, success_callback) => {
        meaning_id = undefined;
        db.transaction(tx => {
            tx.executeSql(
                Meaning.Query.INSERT_MEANING_QUERY,
                [word_id, meaning.meaning_text, meaning.meaning_classification],
                (_, { insertId }) => meaning_id = insertId
            );
        }, error => {
            try {
                error_callback(error);
            } catch (error) {
                console.log(error);
            }
        }, success => {
            try {
                success_callback(meaning_id);
            } catch (error) {
                console.log(error);
            }
        });
    }

    deleteMeaningByWordId = (word_id, error_callback, success_callback) => {
        db.transaction(tx => {
            tx.executeSql(
                Meaning.Query.DELETE_MEANING_BY_WORD_ID_QUERY,
                [word_id],
                (null)
            )
        }, error => {
            try {
                error_callback(error);
            } catch (error) {
                console.log(error);
            }
        }, success => {
            try {
                success_callback(true);
            } catch (error) {
                console.log(error);
            }
        });
    }

    addSeries = (series_title, error_callback, success_callback) => {
        series_id = undefined;
        db.transaction(tx => {
            tx.executeSql(
                Series.Query.INSERT_SERIES_QUERY,
                [series_title],
                (_, { insertId }) => series_id = insertId
            );
        }, error => {
            try {
                error_callback(error);
            } catch (error) {
                console.log(error);
            }
        }, success => {
            try {
                success_callback(series_id);
            } catch (error) {
                console.log(error);
            }
        });
    }

    addWordSeries = (word_id, series_id, error_callback, success_callback) => {
        db.transaction(tx => {
            tx.executeSql(
                WordSeries.Query.INSERT_WORDSERIES_QUERY,
                [word_id, series_id],
                (null)
            )
        }, error => {
            try {
                error_callback(error);
            } catch (error) {
                console.log(error);
            }
        }, success => {
            try {
                success_callback(true);
            } catch (error) {
                console.log(error);
            }
        })
    }

    addTags = (tag_array, error_callback, success_callback) => {
        tag_array.forEach(async (tag) => {
            this.addTag(tag, error_callback, success_callback);
        });
    }

    addTag = (tag, error_callback, success_callback) => {
        tag_id = undefined;
        db.transaction(tx => {
            tx.executeSql(
                Tag.Query.INSERT_TAG_QUERY,
                [tag.tag_title],
                (_, { insertId }) => tag_id = insertId
            );
        }, error => {
            try{
                error_callback(error);
            } catch (error) {
                console.log(error);
            }
        }, success => {
            try {
                success_callback(tag_id);
            } catch (error) {
                console.log(error);
            }
        })
    }

    addWordTags = (word_id, tag_array, error_callback, success_callback) => {
        tag_array.forEach(async (tag) => {
            this.addWordTag(word_id, tag.tag_id, error_callback, success_callback);
        });
    }

    addWordTag = (word_id, tag_id, error_callback, success_callback) => {
        db.transaction(tx => {
            tx.executeSql(
                WordTag.Query.INSERT_WORDTAG_QUERY,
                [word_id, tag_id],
                (null)
            );
        }, error => {
            try {
                error_callback(error);
            } catch (error) {
                console.log(error);
            }
        }, success => {
            try {
                success_callback(true);
            } catch (error) {
                console.log(error);
            }
        })
    }

    getWords = (error_callback, success_callback) => {
        result = undefined;
        db.transaction(tx => {
            tx.executeSql(
                Word.Query.SELECT_ALL_WORD_QUERY_ORDERBY_LATEST,
                [],
                (_, {rows: { _array } }) => result = _array
            )
        }, error => {
            try {
                error_callback(error);
            } catch (error) {
                console.log(error);
            }
        }, success => {
            try {
                success_callback(result);
            } catch (error) {
                console.log(error);
            }
        });
    }

    getWordsByTags = (tag_id, error_callback, success_callback) => {

        // Point is to apply filters
        // For example
        // When tag is clicked
        // You only want to get words that has that tag
        // You do not wnat any other words without the tag

        result = undefined;
        db.transaction(tx => {
            tx.executeSql(
                WordTag.Query.SELECT_ALL_TAGWORD_QUERY,
                [tag_id],
                (_, {rows: { _array } }) => result = _array
            )
        }, error => {
            try {
                error_callback(error);
            } catch (error) {
                console.log(error);
            }
        }, success => {
            try {
                success_callback(result);
            } catch (error) {
                console.log(error);
            }
        });
    }

    getWordss = () => {
        return new Promise((resolve, reject) => {
            result = undefined;
            db.transaction(tx => {
                tx.executeSql(
                    Word.Query.SELECT_ALL_WORD_QUERY,
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

    getMeanings = (word_id, error_callback, success_callback) => {
        result = undefined;
        db.transaction(tx => {
            tx.executeSql(
                Meaning.Query.SELECT_ALL_MEANING_QUERY,
                [word_id],
                (_, {rows: { _array } }) => result = _array 
            );
        }, error => {
            try {
                error_callback(error);
            } catch (error) {
                console.log(error);
            }
        }, success => {
            try {
                success_callback(result)
            } catch (error) {
                console.log(error);
            }
        });
    }

    getMeaningss = (word_id) => {
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

    getSeries = (error_callback, success_callback) => {
        result = undefined;
        db.transaction(tx => {
            tx.executeSql(
                Series.Query.SELECT_ALL_SERIES_QUERY,
                [],
                (_, {rows: { _array } }) => result = _array 
            );
        }, error => {
            try {
                error_callback(error);
            } catch (error) {
                console.log(error);
            }
        }, success => {
            try {
                success_callback(result)
            } catch (error) {
                console.log(error);
            }
        });
    }

    etTag = (tag_title, error_callback, success_callback) => {
        result = undefined;
        db.transaction(tx => {
            tx.executeSql(
                Tag.Query.SELECT_TAGS_QUERY,
                [tag_title],
                (_, {rows: { _array } }) => result = _array
            )
        }, error => {
            try {
                error_callback(error);
            } catch (error) {
                console.log(error);
            }
        }, success => {
            try {
                success_callback(result);
            } catch (error) {
                console.log(error);
            }
        });
    }

    getTags = (error_callback, success_callback) => {
        result = undefined;
        db.transaction(tx => {
            tx.executeSql(
                Tag.Query.SELECT_ALL_TAGS_QUERY,
                [],
                (_, {rows: { _array } }) => result = _array 
            );
        }, error => {
            try {
                error_callback(error);
            } catch (error) {
                console.log(error);
            }
        }, success => {
            try {
                success_callback(result);
            } catch (error) {
                console.log(error);
            }
        });
    }

    getTagss = () => {
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

    getSeriesWords = (series_id, error_callback, success_callback) => {
        result = undefined;
        db.transaction(tx => {
            tx.executeSql(
                WordSeries.Query.SELECT_ALL_SERIESWORD_QUERY,
                [series_id],
                (_, {rows: { _array } }) => result = _array
            )
        }, error => {
            try {
                error_callback(error);
            } catch (error) {
                console.log(error);
            }
        }, success => {
            try {
                success_callback(result);
            } catch (error) {
                console.log(error);
            }
        });
    }

    getWordSeries = (word_id, error_callback, success_callback) => {
        result = undefined;
        db.transaction(tx => {
            tx.executeSql(
                WordSeries.Query.SELECT_ALL_WORDSERIES_QUERY,
                [word_id],
                (_, {rows: { _array } }) => result = _array
            )
        }, error => {
            try {
                error_callback(error);
            } catch (error) {
                console.log(error);
            }
        }, success => {
            try {
                success_callback(result);
            } catch (error) {
                console.log(error);
            }
        });
    }

    getWordTags = (word_id, error_callback, success_callback) => {
        result = undefined;
        db.transaction(tx => {
            tx.executeSql(
                WordTag.Query.SELECT_ALL_WORDTAG_QUERY,
                [word_id],
                (_, {rows: { _array } }) => result = _array
            )
        }, error => {
            try {
                error_callback(error);
            } catch (error) {
                console.log(error);
            }
        }, success => {
            try {
                success_callback(result);
            } catch (error) {
                console.log(error);
            }
        })
    }

    getWordTagss = (word_id) => {
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

    getTagWords = (tag_id, error_callback, success_callback) => {
        result = undefined;
        db.transaction(tx => {
            tx.executeSql(
                WordTag.Query.SELECT_ALL_WORDTAG_QUERY,
                [tag_id],
                (_, {rows: { _array } }) => result = _array
            )
        }, error => {
            try {
                error_callback(error);
            } catch (error) {
                console.log(error);
            }
        }, success => {
            try {
                success_callback(result);
            } catch (error) {
                console.log(error);
            }
        })
    }

    getWordSynonym = (meaning_id, error_callback, success_callback) => {
        result = undefined;
        db.transaction(tx => {
            tx.executeSql(
                WordSynonym.Query.SELECT_ALL_WORDSYNONYM_QUERY,
                [meaning_id],
                (_, {rows: { _array } }) => result = _array
            )
        }, error => {
            try {
                error_callback(error);
            } catch (error) {
                console.log(error);
            }
        }, success => {
            try {
                success_callback(result);
            } catch (error) {
                console.log(error);
            }
        });
    }

    getWordSynonyms = (meaning_id) => {
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