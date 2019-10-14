const TABLE = 'Series';
const COLUMN_ID = 'series_id';
const COLUMN_TITLE = 'series_title';
const COLUMN_DATETIMECREATED = 'series_datetimecreated';

const CREATE_SERIES_TABLE = "CREATE TABLE IF NOT EXISTS " + TABLE + " (" +
	COLUMN_ID + " INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, " +
	COLUMN_TITLE+ " TEXT NOT NULL, " +
	COLUMN_DATETIMECREATED + " TEXT NOT NULL " +
")";
const INSERT_SERIES_QUERY = "INSERT INTO " + TABLE + " (" + COLUMN_TITLE + ", " + COLUMN_DATETIMECREATED + ") VALUES (?, datetime('now'))";
const SELECT_ALL_SERIES_QUERY = "SELECT * FROM " + TABLE;

export default Series = {
    TABLE: TABLE,
    COLUMN_ID: COLUMN_ID,
    COLUMN_TITLE: COLUMN_TITLE,
    COLUMN_DATETIMECREATED: COLUMN_DATETIMECREATED,
    Query: {
        CREATE_SERIES_TABLE: CREATE_SERIES_TABLE,
        INSERT_SERIES_QUERY: INSERT_SERIES_QUERY,
        SELECT_ALL_SERIES_QUERY: SELECT_ALL_SERIES_QUERY,
    }
}