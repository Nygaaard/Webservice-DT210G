//Installerings-script för todo-sida
//Av Andreas Nygård

//Hämta Sqlite3
const sqlite3 = require("sqlite3").verbose();

//Skapa ny databas
const db = new sqlite3.Database("./db/todoList.db");

//Skapa tabell för databas
db.serialize(() => {
    db.run("DROP TABLE if EXISTS todos");

    //Tabell "todos"
    db.run(`
        CREATE TABLE todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEST NOT NULL,
            description TEXT NOT NULL,
            status TEXT DEFAULT 'ej påbörjad' NOT NULL,
            posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        )
    `)
})

db.close();