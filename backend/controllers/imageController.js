import mongoose from "mongoose";
import Grid from "gridfs-stream";
import ImageModel from "../models/imageModel.js";

// Create mongo connection
const conn = mongoose.connection;

// Init gfs
let gfs;

conn.once("open", () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

// @route GET /
// @desc Loads form
const getAllImages = (req, res) => {
  ImageModel.find({}, (err, files) => {
    // Check for errors
    if (err) {
      console.error("Error fetching files:", err);
      return res.status(500).send("Internal Server Error");
    }

    // Check if files
    if (!files || files.length === 0) {
      return res.render("index", { files: false });
    }

    files = files.map((file) => {
      if (
        file.contentType === "image/jpeg" ||
        file.contentType === "image/png"
      ) {
        file.isImage = true;
      } else {
        file.isImage = false;
      }
      return file;
    });

    res.render("index", { files: files });
  });
};
// @route POST /upload
// @desc  Uploads file to DB
const createImage = (req, res) => {
  // Create a new Image document using the ImageModel
  const newImage = new ImageModel({
    filename: req.file.filename,
    fileId: req.file.id,
    contentType: req.file.contentType,
    uploadDate: new Date(),
    // Add other fields as needed
  });

  // Save the image document to the database
  newImage.save((err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error saving image to the database" });
    }

    res.redirect("/");
  });
};
// @route GET /files
// @desc  Display all files in JSON
const getAllFilesJson = (req, res) => {
  // Assuming ImageModel is your Mongoose model for images
  ImageModel.find({}, (err, images) => {
    // Check for errors
    if (err) {
      return res
        .status(500)
        .json({ error: "Error fetching images from the database" });
    }

    // Check if images exist
    if (!images || images.length === 0) {
      return res.status(404).json({ err: "No images exist" });
    }

    // Images exist
    return res.json(images);
  });
};
// @route GET /files/:filename
// @desc  Display single file object
const getSingleFile = (req, res) => {
  // Use the ImageModel to find one document based on filename
  ImageModel.findOne({ filename: req.params.filename }, (err, image) => {
    // Check if image
    if (!image || image.length === 0) {
      return res.status(404).json({
        err: "No image exists",
      });
    }

    // Image exists, you can modify the response based on your needs
    return res.json({
      filename: image.filename,
      fileId: image.fileId,
      contentType: image.contentType,
      uploadDate: image.uploadDate,
      // Add other fields as needed
    });
  });
};
// @route GET /image/:filename
// @desc Display Image
const getImage = (req, res) => {
  // Find the image in the database using the filename
  ImageModel.findOne({ filename: req.params.filename }, (err, image) => {
    // Check if the image exists
    if (!image || err) {
      return res.status(404).json({
        err: "No image exists",
      });
    }

    // Read the image from the database and pipe it to the response
    const readstream = gfs.createReadStream({ filename: image.filename });
    readstream.pipe(res);
  });
};
// @route DELETE /files/:id
// @desc  Delete file
const deleteFile = (req, res) => {
  const imageId = req.params.id;

  // Find the image in the database by its ID
  ImageModel.findByIdAndRemove(imageId, (err, deletedImage) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error deleting image from the database" });
    }

    if (!deletedImage) {
      return res.status(404).json({ error: "Image not found" });
    }

    // If the image was found and deleted, also remove the associated file from GridFS
    gfs.remove(
      { _id: deletedImage.fileId, root: "uploads" },
      (err, gridStore) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Error deleting file from GridFS" });
        }

        res.redirect("/");
      }
    );
  });
};

export {
  getAllImages,
  createImage,
  getAllFilesJson,
  getSingleFile,
  getImage,
  deleteFile,
};
