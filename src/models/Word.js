const Word = {
    TABLE: "Word",
    COLUMN_ID: "id",
    COLUMN_STRING: "string",
    COLUMN_CLASS: "class",
    COLUMN_DEFINITION: "definition",
    COLUMN_PRONUNCIATION: "pronunciation",
    COLUMN_ORIGIN: "origin",
    CREATE_TABLE: "CREATE TABLE IF NOT EXISTS " + this.TABLE + " (" + this.COLUMN_ID + " INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, " + this.COLUMN_STRING + " TEXT NOT NULL, " + this.COLUMN_CLASS + " TEXT, " + this.COLUMN_DEFINITION + " TEXT, " + this.COLUMN_PRONUNCIATION + " TEXT, " + this.COLUMN_ORIGIN + " TEXT)"
}