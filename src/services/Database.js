import { SQLite } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

const DATABASE_NAME = 'db.db';

const Word = {
    TABLE: 'Word',
    COLUMN_ID: 'word_id',
    COLUMN_TEXT: 'word_text',
    COLUMN_PRONUNCIATION: 'word_pronunciation',
    COLUMN_ORIGIN: 'word_origin',
    COLUMN_DATETIMEADDED: "word_datetimeadded",
}

const Meaning = {
    TABLE: 'Meaning',
    COLUMN_ID: 'meaning_id',
    COLUMN_WORD_ID: 'meaning_word_id',
    COLUMN_TEXT: 'meaning_text',
    COLUMN_WORD_CLASSIFICATION: 'meaning_classification',
    COLUMN_DATETIMECREATED: 'meaning_datetimecreated',
}

const Series = {
    TABLE: 'Series',
    COLUMN_ID: 'series_id',
    COLUMN_TITLE: 'series_title',
    COLUMN_DATETIMECREATED: 'series_datetimecreated',
}

const Tag = {
    TABLE: 'Tag',
    COLUMN_ID: 'tag_id',
    COLUMN_TITLE: 'tag_title',
    COLUMN_DATETIMECREATED: 'tag_datetimecreated',
}

const WordSeries = {
    TABLE: 'WordSeries',
    COLUMN_ID: 'wordseries_id',
    COLUMN_TITLE: 'wordseries_title',
    COLUMN_WORD_ID: 'wordseries_word_id',
    COLUMN_SERIES_ID: 'wordseries_series_id',
    COLUMN_DATETIMELINKED: 'wordseries_datetimelinked',
}

const WordTag = {
    TABLE: 'WordTag',
    COLUMN_ID: 'wordtag_id',
    COLUMN_WORD_ID: 'wordtag_word_id',
    COLUMN_TAG_ID: 'wordtag_tag_id',
    COLUMN_DATETIMELINKED: 'wordtag_datetimelinked',
}

const WordSynonym = {
    TABLE: 'WordSynonym',
    COLUMN_ID: 'wordsynonym_id',
    COLUMN_MEANING_ID: 'wordsynonym_meaning_id',
    COLUMN_WORD_ID: 'wordsynonym_word_id',
    COLUMN_DATETIMELINKED: 'word_synonym_datetimelinked',
}

const CREATE_WORD_TABLE = "CREATE TABLE " + Word.TABLE + " (" +
    Word.COLUMN_ID + " INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, " +
	Word.COLUMN_TEXT + " TEXT NOT NULL, " +
	Word.COLUMN_PRONUNCIATION + " TEXT, " +
	Word.COLUMN_ORIGIN + " TEXT, " +
	Word.COLUMN_DATETIMEADDED + " TEXT NOT NULL" +
")";

const CREATE_MEANING_TABLE = "CREATE TABLE IF NOT EXISTS " + Meaning.TABLE + " (" +
    Meaning.COLUMN_ID + " INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, " +
	Meaning.COLUMN_WORD_ID + " INTEGER NOT NULL, " +
	Meaning.COLUMN_TEXT + " TEXT NOT NULL, " +
	Meaning.COLUMN_WORD_CLASSIFICATION + " TEXT, " +
	Meaning.COLUMN_DATETIMECREATED + " TEXT NOT NULL" +
")";

const CREATE_SERIES_TABLE = "CREATE TABLE " + Series.TABLE + " (" +
	Series.COLUMN_ID + " INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, " +
	Series.COLUMN_TITLE+ " TEXT NOT NULL, " +
	Series.COLUMN_DATETIMECREATED + " TEXT NOT NULL " +
")";

const CREATE_TAG_TABLE = "CREATE TABLE " + Tag.TABLE + " (" +
	Tag.COLUMN_ID + " INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, " +
	Tag.COLUMN_TITLE + " TEXT NOT NULL, " +
	Tag.COLUMN_DATETIMECREATED + " TEXT NOT NULL" +
")";

const CREATE_WORDSERIES_TABLE = "CREATE TABLE " + WordSeries.TABLE + " (" +
    WordSeries.COLUMN_ID + " INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, " +
	WordSeries.COLUMN_WORD_ID + " INTEGER NOT NULL, " +
	WordSeries.COLUMN_SERIES_ID + " INTEGER NOT NULL, " +
	WordSeries.COLUMN_DATETIMELINKED + " INTEGER NOT NULL, " +
	"FOREIGN KEY(" + WordSeries.COLUMN_WORD_ID + ") REFERENCES " + Word.TABLE + "(" + Word.COLUMN_ID + "), " +
	"FOREIGN KEY(" + WordSeries.COLUMN_SERIES_ID + ") REFERENCES " + Series.TABLE + "(" + Series.COLUMN_ID + ") " +
")";

const CREATE_WORDTAG_TABLE = "CREATE TABLE " + WordTag.TABLE + " (" +
	WordTag.COLUMN_ID + " INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, " +
	WordTag.COLUMN_WORD_ID + " INTEGER NOT NULL, " +
	WordTag.COLUMN_TAG_ID + " INTEGER NOT NULL, " +
	WordTag.COLUMN_DATETIMELINKED + " TEXT NOT NULL, " +
	"FOREIGN KEY(" +WordTag.COLUMN_WORD_ID + ") REFERENCES " + WordTag.TABLE + "(" + WordTag.COLUMN_ID + "), " +
	"FOREIGN KEY(" + WordTag.COLUMN_TAG_ID + ") REFERENCES " + Tag.TABLE + "(" + Tag.COLUMN_ID + ") " +
")";

const CREATE_WORDSYNONYM_TABLE = "CREATE TABLE " + WordSynonym.TABLE + " (" +
    WordSynonym.COLUMN_ID + " INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, " +
	WordSynonym.COLUMN_WORD_ID + " INTEGER NOT NULL, " +
	WordSynonym.COLUMN_MEANING_ID + " INTEGER NOT NULL, " +
	WordSynonym.COLUMN_DATETIMELINKED + " TEXT NOT NULL, " +
	"FOREIGN KEY(" + WordSynonym.COLUMN_MEANING_ID + ") REFERENCES " + Meaning.TABLE + "(" + Meaning.COLUMN_ID + "), " +
	"FOREIGN KEY(" + WordSynonym.COLUMN_WORD_ID + ") REFERENCES " + Word.TABLE + "(" + Word.COLUMN_ID + ") " +
")";

const INSERT_WORD_QUERY = "INSERT INTO " + Word.TABLE + " (" + Word.COLUMN_TEXT + ", " + Word.COLUMN_PRONUNCIATION + ", " + Word.COLUMN_ORIGIN + ", " + Word.COLUMN_DATETIMEADDED + ") VALUES (?, ?, ?, datetime('now'))";

const INSERT_MEANING_QUERY = "INSERT INTO " + Meaning.TABLE + " (" + Meaning.COLUMN_WORD_ID + ", " + Meaning.COLUMN_TEXT + ", " + Meaning.COLUMN_WORD_CLASSIFICATION + ", " + Meaning.COLUMN_DATETIMECREATED + ") VALUES (?, ?, ?, datetime('now'))";

const INSERT_WORDSYNONYM_QUERY = "INSERT INTO " + WordSynonym.TABLE + " (" + WordSynonym.COLUMN_WORD_ID + ", " + WordSynonym.COLUMN_MEANING_ID + ", " + WordSynonym.COLUMN_DATETIMELINKED + ") VALUES (?, ?, datetime('now'))";

const INSERT_TAG_QUERY = "INSERT INTO " + Tag.TABLE + " (" + Tag.COLUMN_TITLE + ", " + Tag.COLUMN_DATETIMECREATED + ") VALUES (?, datetime('now'))";

const INSERT_WORDTAG_QUERY = "INSERT INTO " + WordTag.TABLE + " (" + WordTag.COLUMN_WORD_ID + ", " + WordTag.COLUMN_TAG_ID + ", " + WordTag.COLUMN_DATETIMELINKED + ") VALUES (?, ?, datetime('now'))";

const INSERT_SERIES_QUERY = "INSERT INTO " + Series.TABLE + " (" + Series.COLUMN_TITLE + ", " + Series.COLUMN_DATETIMECREATED + ") VALUES (?, datetime('now'))";

const INSERT_WORDSERIES_QUERY = "INSERT INTO " + WordSeries.TABLE + " (" + WordSeries.COLUMN_WORD_ID + ", " + WordSeries.COLUMN_SERIES_ID + ", " + WordSeries.COLUMN_DATETIMELINKED + ") VALUES (?, ?, datetime('now'))";

const SELECT_ALL_WORD_QUERY = "SELECT * FROM " + Word.TABLE;

const SELECT_ALL_WORD_QUERY_ORDERBY_LATEST = "SELECT * FROM " + Word.TABLE + " ORDER BY " + Word.COLUMN_DATETIMEADDED + " DESC"

const SELECT_ALL_MEANING_QUERY = "SELECT * FROM " + Meaning.TABLE + " WHERE " + Meaning.COLUMN_WORD_ID + " = ?";

const SELECT_ALL_SERIES_QUERY = "SELECT * FROM " + Series.TABLE;

const SELECT_ALL_TAGS_QUERY = "SELECT * FROM " + Tag.TABLE;

const SELECT_ALL_SERIESWORD_QUERY = "SELECT * FROM " + Word.TABLE + " INNER JOIN " + WordSeries.TABLE + " ON " + Word.COLUMN_ID + " = " + WordSeries.COLUMN_WORD_ID + " WHERE " + WordSeries.COLUMN_SERIES_ID + " = ?";

const SELECT_ALL_WORDSERIES_QUERY = "SELECT * FROM " + Series.TABLE + " INNER JOIN " + WordSeries.TABLE + " ON "  + Series.COLUMN_ID + " = " + WordSeries.COLUMN_SERIES_ID + " WHERE " + WordSeries.COLUMN_WORD_ID + " = ?";

const SELECT_ALL_WORDTAG_QUERY = "SELECT * FROM " + Tag.TABLE + " INNER JOIN " + WordTag.TABLE + " ON " + Tag.COLUMN_ID + " = " + WordTag.COLUMN_TAG_ID + " WHERE " + WordTag.COLUMN_WORD_ID + " = ?";

const SELECT_ALL_TAGWORD_QUERY = "SELECT * FORM " + Word.TABLE + " INNER JOIN " + WordTag.TABLE + " ON " + Word.COLUMN_ID + " = " + WordTag.COLUMN_WORD_ID + " WHERE " + WordTag.COLUMN_TAG_ID + " = ?";

const SELECT_ALL_WORDSYNONYM_QUERY = "SELECT " + Word.TABLE + ".* FROM " + Word.TABLE + " INNER JOIN " + WordSynonym.TABLE + " ON " + Word.COLUMN_ID + " = " + WordSynonym.COLUMN_WORD_ID + " WHERE " + WordSynonym.COLUMN_MEANING_ID + " = ?";

const SELECT_ALL_SYNONYMWORD_QUERY = "SELECT * FROM " + Meaning.TABLE + " INNER JOIN " + WordSynonym.TABLE + " ON " + Meaning.COLUMN_ID + " = " + WordSynonym.COLUMN_MEANING_ID + " WHERE " + WordSynonym.COLUMN_WORD_ID + " = ?"

const SELECT_WORD_QUERY = "SELECT * FROM " + Word.TABLE + " WHERE " + Word.COLUMN_ID + " = ?";

db = SQLite.openDatabase(DATABASE_NAME);

class Database {

    createDatabase = () => {
        db.transaction(tx => {
            tx.executeSql(CREATE_WORD_TABLE);
        }, error => {
            console.log(error);
        });

        db.transaction(tx => {
            tx.executeSql(CREATE_MEANING_TABLE);
        }, error => {
            console.log(error);
        });

        db.transaction(tx => {
            tx.executeSql(CREATE_SERIES_TABLE);
        }, error => {
            console.log(error);
        });

        db.transaction(tx => {
            tx.executeSql(CREATE_TAG_TABLE);
        }, error => {
            console.log(error);
        });

        db.transaction(tx => {
            tx.executeSql(CREATE_WORDSERIES_TABLE);
        }, error => {
            console.log(error);
        });

        db.transaction(tx => {
            tx.executeSql(CREATE_WORDTAG_TABLE);
        }, error => {
            console.log(error);
        });

        db.transaction(tx => {
            tx.executeSql(CREATE_WORDSYNONYM_TABLE);
        }, error => {
            console.log(error);
        });
    }

    deleteDatabase = () => {
        FileSystem.deleteAsync(FileSystem.documentDirectory + "SQLite/" + DATABASE_NAME);
    }

    resetDatabase = () => {
        this.deleteDatabase();
        this.createDatabase();
    }

    addWord = (word, error_callback, success_callback) => {
        word_id = undefined;
        db.transaction(tx => {
            tx.executeSql(
                INSERT_WORD_QUERY,
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

    addMeanings = (word_id, meaning_array, error_callback, success_callback) => {
        meaning_array.forEach(async (meaning) => {
            this.addMeaning(word_id, meaning, error_callback, success_callback);
        });
    }

    addMeaning = (word_id, meaning, error_callback, success_callback) => {
        meaning_id = undefined;
        db.transaction(tx => {
            tx.executeSql(
                INSERT_MEANING_QUERY,
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

    addSeries = (series_title, error_callback, success_callback) => {
        series_id = undefined;
        db.transaction(tx => {
            tx.executeSql(
                INSERT_SERIES_QUERY,
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
                INSERT_WORDSERIES_QUERY,
                [word_id, series_id],
                (_)
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
        db.transaction(tx => {
            tx.executeSql(
                INSERT_TAG_QUERY,
                [tag.tag_title],
                (null)
            );
        }, error => {
            try{
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

    addWordTags = (word_id, tag_array, error_callback, success_callback) => {
        tag_array.forEach(async (tag) => {
            this.addWordTag(word_id, tag.tag_id, error_callback, success_callback);
        });
    }

    addWordTag = (word_id, tag_id, error_callback, success_callback) => {
        db.transaction(tx => {
            tx.executeSql(
                INSERT_WORDTAG_QUERY,
                [word_id, tag_id],
                (_)
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
                SELECT_ALL_WORD_QUERY_ORDERBY_LATEST,
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

    getMeanings = (word_id, error_callback, success_callback) => {
        result = undefined;
        db.transaction(tx => {
            tx.executeSql(
                SELECT_ALL_MEANING_QUERY,
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

    getSeries = (error_callback, success_callback) => {
        result = undefined;
        db.transaction(tx => {
            tx.executeSql(
                SELECT_ALL_SERIES_QUERY,
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

    getTags = (error_callback, success_callback) => {
        result = undefined;
        db.transaction(tx => {
            tx.executeSql(
                SELECT_ALL_TAGS_QUERY,
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
                console.log(result);
                success_callback(result)
            } catch (error) {
                console.log(error);
            }
        });
    }

    getSeriesWords = (series_id, error_callback, success_callback) => {
        result = undefined;
        db.transaction(tx => {
            tx.executeSql(
                SELECT_ALL_SERIESWORD_QUERY,
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
                SELECT_ALL_WORDSERIES_QUERY,
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
                SELECT_ALL_WORDTAG_QUERY,
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

    getTagWords = (tag_id, error_callback, success_callback) => {
        result = undefined;
        db.transaction(tx => {
            tx.executeSql(
                SELECT_ALL_WORDTAG_QUERY,
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
                SELECT_ALL_WORDSYNONYM_QUERY,
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

    printDatabaseLocation() {
        console.log(FileSystem.documentDirectory + "SQLite/" + DATABASE_NAME);
    }

}

const database = new Database();

export default database;