const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const PORT = 3000;

const dataDir = path.join(__dirname, "data");
const filePath = path.join(dataDir, "notes.txt");

// Create data directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Create notes file if it doesn't exist
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "");
}

// Home
app.get("/", (req, res) => {
    res.send("📘 Docker Volume Demo");
});

// Save a note
app.post("/note", (req, res) => {
    const note = req.body.note;

    if (!note) {
        return res.status(400).json({
            message: "Please provide a note"
        });
    }

    fs.appendFileSync(filePath, note + "\n");

    res.json({
        message: "Note Saved"
    });
});

// View all notes
app.get("/notes", (req, res) => {

    const notes = fs.readFileSync(filePath, "utf8");

    res.type("text/plain").send(notes);
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
