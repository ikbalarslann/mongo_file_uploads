import express from "express";
import bodyParser from "body-parser";

import methodOverride from "method-override";
import chalk from "chalk";
import dotenv from "dotenv";
import imageRoutes from "./routes/imageRoutes.js";
import connectDB from "./config/db.js";

//
import mongoose from "mongoose";
import upload from "./middlewares/uploadMiddleware.js";
import Grid from "gridfs-stream";

dotenv.config();

const app = express();

const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

// Mongo URI
const mongoURI = process.env.MONGO_URI;

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;

conn.once("open", () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

// @route GET /
// @desc Loads form
app.get("/", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      res.render("index", { files: false });
    } else {
      files.map((file) => {
        if (
          file.contentType === "image/jpeg" ||
          file.contentType === "image/png"
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
      res.render("index", { files: files });
    }
  });
});

// @route POST /upload
// @desc  Uploads file to DB
app.post("/upload", upload.single("file"), (req, res) => {
  // res.json({ file: req.file });
  res.redirect("/");
});

// @route GET /files
// @desc  Display all files in JSON
app.get("/files", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: "No files exist",
      });
    }

    // Files exist
    return res.json(files);
  });
});

// @route GET /files/:filename
// @desc  Display single file object
app.get("/files/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }
    // File exists
    return res.json(file);
  });
});

// @route GET /image/:filename
// @desc Display Image
app.get("/image/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }

    // Check if image
    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image",
      });
    }
  });
});

// @route DELETE /files/:id
// @desc  Delete file
app.delete("/files/:id", (req, res) => {
  gfs.remove({ _id: req.params.id, root: "uploads" }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }

    res.redirect("/");
  });
});

app.listen(port, () =>
  console.log(chalk.green(`Server started on port ${port}`))
);

// const express = require("express");
// const bodyParser = require("body-parser");
// const path = require("path");
// const crypto = require("crypto");
// const mongoose = require("mongoose");
// const multer = require("multer");
// const GridFsStorage = require("multer-gridfs-storage");
// const Grid = require("gridfs-stream");
// const methodOverride = require("method-override");
