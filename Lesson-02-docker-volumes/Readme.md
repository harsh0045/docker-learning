# 📘 Lesson-02: Docker Volumes

## 🎯 Objective

Learn how Docker Volumes help to persist data even after a container is deleted.

In this project, we will create a simple Notes application that stores data in a file.

Without a Volume:
- Data is lost when the container is removed.

With a Volume:
- Data remains safe even after removing and recreating the container.

---

# 📂 Project Structure

```
Lesson-02-Docker-Volumes/
│
├── app.js
├── package.json
├── Dockerfile
├── .dockerignore
├── README.md
└── screenshots/
```

---

# Step 1: Create package.json

Create a file named `package.json`.

```json
{
  "name": "docker-volume-demo",
  "version": "1.0.0",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "express": "^4.21.0"
  }
}
```

> Note:
> We don't run `npm install` locally.
> Docker will install dependencies while building the image using `RUN npm install`.

---

# Step 2: Create app.js

Create a file named `app.js`.

```javascript
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());

const PORT = 3000;

const dataDir = path.join(__dirname, "data");
const filePath = path.join(dataDir, "notes.txt");


// Create data directory
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}


// Create notes file
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "");
}


// Home route
app.get("/", (req, res) => {
    res.send("📘 Docker Volume Demo");
});


// Save note
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


// Read notes
app.get("/notes", (req, res) => {

    const notes = fs.readFileSync(filePath, "utf8");

    res.type("text/plain").send(notes);
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

---

# Step 3: Create Dockerfile

Create a file named `Dockerfile`.

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm","start"]
```

### Dockerfile Flow

```
Node Image
     |
     ▼
Create /app directory
     |
     ▼
Copy package.json
     |
     ▼
Install dependencies
     |
     ▼
Copy application code
     |
     ▼
Start Node.js application
```

---

# Step 4: Build Docker Image

Run:

```bash
docker build -t notes-app:v1 .
```

Check image:

```bash
docker images
```

Expected:

```
REPOSITORY     TAG
notes-app      v1
```

---

# Step 5: Run Container Without Volume

Run:

```bash
docker run -d --name notes-container -p 3000:3000 notes-app:v1
```

Check:

```bash
docker ps
```

---

# Step 6: Save a Note

Send a request:

### Linux / WSL

```bash
curl -X POST http://localhost:3000/note \
-H "Content-Type: application/json" \
-d "{\"note\":\"Learn Docker Volumes\"}"
```

### PowerShell

```powershell
Invoke-RestMethod `
-Uri "http://localhost:3000/note" `
-Method POST `
-ContentType "application/json" `
-Body '{"note":"Learn Docker Volumes"}'
```

Response:

```
{
 message: "Note Saved"
}
```

---

# Step 7: View Notes

```bash
curl http://localhost:3000/notes
```

Output:

```
Learn Docker Volumes
```

---

# Step 8: Remove Container

Remove the container:

```bash
docker rm -f notes-container
```

Run the container again:

```bash
docker run -d --name notes-container -p 3000:3000 notes-app:v1
```

Check notes:

```bash
curl http://localhost:3000/notes
```

Output:

```
(empty)
```

### Why?

Because the data was stored inside the container.

When the container was deleted:

```
Container Deleted
        |
        ▼
notes.txt Deleted
        |
        ▼
Data Lost ❌
```

---

# Step 9: Create Docker Volume

Create a volume:

```bash
docker volume create notes-data
```

Check volumes:

```bash
docker volume ls
```

Output:

```
DRIVER    VOLUME NAME
local     notes-data
```

---

# Step 10: Run Container With Volume

Remove old container:

```bash
docker rm -f notes-container
```

Run with volume:

### Linux / WSL

```bash
docker run -d \
--name notes-container \
-p 3000:3000 \
-v notes-data:/app/data \
notes-app:v1
```

### PowerShell

```powershell
docker run -d --name notes-container -p 3000:3000 -v notes-data:/app/data notes-app:v1
```

---

# Step 11: Save Data Again

Add a note:

```powershell
Invoke-RestMethod `
-Uri "http://localhost:3000/note" `
-Method POST `
-ContentType "application/json" `
-Body '{"note":"Docker Volume Works"}'
```

Check:

```bash
curl http://localhost:3000/notes
```

Output:

```
Docker Volume Works
```

---

# Step 12: Remove Container Again

```bash
docker rm -f notes-container
```

---

# Step 13: Create New Container Using Same Volume

Run:

### Linux / WSL

```bash
docker run -d \
--name notes-container \
-p 3000:3000 \
-v notes-data:/app/data \
notes-app:v1
```

### PowerShell

```powershell
docker run -d --name notes-container -p 3000:3000 -v notes-data:/app/data notes-app:v1
```

---

# Step 14: Verify Data Persistence

Check notes:

```bash
curl http://localhost:3000/notes
```

Output:

```
Docker Volume Works
```

🎉 Data is still available.

---

# Docker Volume Concept

Without Volume:

```
Container
    |
    ▼
notes.txt
    |
Remove Container
    |
    ▼
Data Lost ❌
```

With Volume:

```
Container
    |
    ▼
Docker Volume
    |
Remove Container
    |
    ▼
Data Safe ✅
```

---

# Useful Volume Commands

List volumes:

```bash
docker volume ls
```

Inspect volume:

```bash
docker volume inspect notes-data
```

Remove volume:

```bash
docker volume rm notes-data
```

Remove unused volumes:

```bash
docker volume prune
```

---

# Key Learning

- Containers are temporary.
- Volumes store data permanently.
- Volumes exist independently from containers.
- A new container can reuse the same volume.
- Databases like MySQL, PostgreSQL, MongoDB use volumes for persistence.
