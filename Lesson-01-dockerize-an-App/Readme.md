# 🚀 Dockerize a Node.js Application

## Step 1: Create a Node.js Application

Create the following files:

- `app.js`
- `package.json`

---

## Step 2: Create a Dockerfile

Create a file named `Dockerfile` in the project root.

---

## Step 3: Create a `.dockerignore` File

Ignore unnecessary files such as:

- `node_modules`
- `.git`

---

## Step 4: Build the Docker Image

```bash
docker build -t node-app:v1 .
```

---

## Step 5: Verify the Image

```bash
docker images
```

---

## Step 6: Run the Docker Container

```bash
docker run -d --name node-container -p 3000:3000 node-app:v1
```

---

## Step 7: Verify the Running Container

```bash
docker ps
```

---

## Step 8: Access the Application

Open your browser:

```
http://localhost:3000
```

---
