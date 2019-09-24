import { SQLite } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

const DATABASE_NAME = 'db.db';

const Word = {
    TABLE: 'Word',
    COLUMN_ID: 'word_id',
    COLUMN_TEXT: 'word_text',
    COLUMN_CLASS: 'word_class',
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
    COLUMN_MEANING_ID: 'wordsynonym_meaning_id',
    COLUMN_WORD_ID: 'wordsynonym_word_id',
    COLUMN_DATETIMELINKED: 'word_synonym_datetimelinked',
}

const CREATE_WORD_TABLE = "CREATE TABLE " + Word.TABLE + " (" +
    Word.COLUMN_ID + " INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, " +
	Word.COLUMN_TEXT + " TEXT NOT NULL, " +
	Word.COLUMN_CLASS + " TEXT, " +
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
    WordSeries.COLUMN_TITLE + " TEXT NOT NULL, " +
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
	WordSynonym.COLUMN_WORD_ID + " NTEGER NOT NULL, " +
	WordSynonym.COLUMN_MEANING_ID + " INTEGER NOT NULL, " +
	WordSynonym.COLUMN_DATETIMELINKED + " TEXT NOT NULL, " +
	"FOREIGN KEY(" + WordSynonym.COLUMN_MEANING_ID + ") REFERENCES " + Meaning.TABLE + "(" + Word.COLUMN_ID + "), " +
	"FOREIGN KEY(" + WordSynonym.COLUMN_WORD_ID + ") REFERENCES " + Word.TABLE + "(" + Word.COLUMN_ID + ") " +
")";

const INSERT_WORD_QUERY = "INSERT INTO Word (" + Word.COLUMN_TEXT + ", " + Word.COLUMN_CLASS + ", " + Word.COLUMN_PRONUNCIATION + ", " + Word.COLUMN_ORIGIN + ", " + Word.COLUMN_DATETIMEADDED + ") VALUES (?, ?, ?, ?, datetime('now'));";

const INSERT_MEANING_QUERY = "INSERT INTO Meaning (" + Meaning.COLUMN_WORD_ID + ", " + Meaning.COLUMN_TEXT + ", " + Meaning.COLUMN_WORD_CLASSIFICATION + ", " + Meaning.COLUMN_DATETIMECREATED + ") VALUES (?, ?, ?, datetime('now'));";

const db = SQLite.openDatabase(DATABASE_NAME);

class Database {

    createDatabase = () => {
        db.transaction(tx => {
            tx.executeSql(CREATE_WORD_TABLE);
        }, err => {
            console.log(err);
        });

        db.transaction(tx => {
            tx.executeSql(CREATE_MEANING_TABLE);
        }, err => {
            console.log(err);
        });

        db.transaction(tx => {
            tx.executeSql(CREATE_SERIES_TABLE);
        }, err => {
            console.log(err);
        });

        db.transaction(tx => {
            tx.executeSql(CREATE_TAG_TABLE);
        }, err => {
            console.log(err);
        });

        db.transaction(tx => {
            tx.executeSql(CREATE_WORDSERIES_TABLE);
        }, err => {
            console.log(err);
        });

        db.transaction(tx => {
            tx.executeSql(CREATE_WORDTAG_TABLE);
        }, err => {
            console.log(err);
        });

        db.transaction(tx => {
            tx.executeSql(CREATE_WORDSYNONYM_TABLE);
        }, err => {
            console.log(err);
        });
    }

    deleteDatabase = () => {
        FileSystem.deleteAsync(FileSystem.documentDirectory + "SQLite/" + DATABASE_NAME);
    }

    resetDatabase = () => {
        console.log(FileSystem.documentDirectory + "SQLite/" + DATABASE_NAME + ".db");
        this.deleteDatabase();
        this.createDatabase();
    }

    addWord = (word) => {
        db.transaction(tx => {
            tx.executeSql(
                INSERT_WORD_QUERY,
                [word.word_text, word.word_class, word.word_pronounciation, word.word_origin],
                (_, { insertId }) => word.word_id = insertId
            );
        }, err => {
            console.log(err);
        }, success => {
            return word.word_id;
        });
    }

    addMeaning = (wordid, meaning) => {
        db.transaction(tx => {
            tx.executeSql(
                INSERT_MEANING_QUERY,
                [wordid, meaning.meaning_string, meaning.meaning_classification],
                (_, { insertId }) => meaning.meaning_id = insertId
            );
        });
    }

    addSynonym = (meaning_id, word) => {

    }

    readDirectory() {
        console.log('lmao1');
        console.log(FileSystem.documentDirectory + "SQLite/" + DATABASE_NAME + ".db");
    }

}

const database = new Database();

export default database;
