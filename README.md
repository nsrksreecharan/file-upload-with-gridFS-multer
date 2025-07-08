
# File Upload API using GridFS, Multer, and MongoDB

This project implements a Node.js API that supports file uploads directly to **MongoDB's GridFS** using **Multer** and **GridFSBucket** for storage.

## Features

* Upload single or multiple files to MongoDB using GridFS.
* Files are split and stored in `fs.files` and `fs.chunks` collections.
* Automatically sets up a GridFSBucket when MongoDB connects.
* Handles different file types like images, PDFs, and videos.
* Download and delete files from GridFS.
* Prevents duplicate uploads (optional strategy).
* Follows modular and maintainable Express architecture.

---

## 🛠️ Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB + GridFS**
* **Mongoose**
* **Multer**
* **multer-gridfs-storage**

---

## ⚠️ Compatibility Fix

The latest versions of some packages caused issues (e.g., `_id` undefined errors during uploads).
So we downgraded to stable versions that work seamlessly with `multer-gridfs-storage`.

```bash
npm uninstall multer-gridfs-storage mongoose mongodb
npm install multer-gridfs-storage@5.0.2 mongoose@6.10.0 mongodb@4.10.0
```
---

## API Endpoints

### 🔸 Upload File

```http
POST /file-api/upload
```

* `form-data`: `file=<yourfile>`
* Stores file in GridFS under `uploads.files` and `uploads.chunks`.

---

### 🔸 Get File by Filename

```http
GET /file-api/file/:filename
```

* Streams the file directly from GridFS.
* Example: `/file-api/file/sample.jpg`

---

### 🔸 Download File

```http
GET /file-api/download/:filename
```

* Forces file download via `Content-Disposition` header.

---

### 🔸 Delete File

```http
DELETE /file-api/file?id=<file_id>
```

* Deletes file by its ObjectId from GridFS.

---

## 📚 Folder Structure

```bash
├── app.js
├── server.js
├── config/
│   └── db.js           # MongoDB + GridFSBucket setup
├── middleware/
│   └── upload.js       # Multer GridFS storage config
├── router/
│   └── fileRoutes.js   # API routes
├── uploads/            # (Only for local/memory uploads if needed)
├── .env
└── README.md
```

---
