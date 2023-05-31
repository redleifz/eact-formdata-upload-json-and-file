import express from "express";
import multer from "multer";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import mysql from "mysql2";

const app = express();
function fileFilter(req, file, cb) {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, GIF, and PDF files are allowed."
      )
    );
  }
}

app.use(cors()); // Enable CORS for all routes

const uploadDestination = "uploads";

if (!fs.existsSync(uploadDestination)) {
  fs.mkdirSync(uploadDestination, { recursive: true });
}

let modifiedFileNameArray = [];

const storage = multer.diskStorage({
  destination: uploadDestination,
  filename: (req, file, cb) => {
    const uniqueIdentifier = uuidv4();
    const fileParts = file.originalname.split(".");
    const extension = fileParts.length > 1 ? fileParts.pop() : "";
    const name = fileParts.join(".");
    const modifiedFileName = `${name}-${uniqueIdentifier}.${extension}`;
    modifiedFileNameArray.push(modifiedFileName);
    cb(null, modifiedFileName);
  },
});



const upload = multer({ storage: storage, fileFilter: fileFilter });

app.use(cors()); // Enable CORS for all routes

app.post("/api/upload", upload.any(), (req, res) => {
  console.log(modifiedFileNameArray)
  const values = JSON.parse(req.body.values);
  console.log(values)
  res.sendStatus(200);
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
