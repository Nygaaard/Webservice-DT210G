// Requires
const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

// Anslut till databas
const db = new sqlite3.Database("./db/todoList.db");

// Inställningar
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Valideringsfunktion för status
const validStatus = ["ej påbörjad", "pågående", "avklarad"];

// Routing

// GET
app.get("/todos", (req, res) => {
    db.all("SELECT * FROM todos", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// POST
app.post("/todos", (req, res) => {
    const { title, description, status } = req.body;

    //Validera status-fält
    if (!validStatus.includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
    }
    //Sätt värden i tabellen - parametriserade frågor
    db.run("INSERT INTO todos (title, description, status) VALUES (?, ?, ?)", [title, description, status || 'ej påbörjad'], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ id: this.lastID });
    });
});

// DELETE
app.delete("/todos/:id", (req, res) => {
    const { id } = req.params;
    //Radera från tabell utifrån id
    db.run("DELETE FROM todos WHERE id = ?", id, function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ changes: this.changes });
    });
});

// PUT
app.put("/todos/:id", (req, res) => {
    const { title, description, status } = req.body;
    const { id } = req.params;
    //Kontrollera status-fält
    if (!validStatus.includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
    }
    //Uppdatera tabell utifrån id
    db.run("UPDATE todos SET title = ?, description = ?, status = ? WHERE id = ?", [title, description, status, id], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ changes: this.changes });
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
