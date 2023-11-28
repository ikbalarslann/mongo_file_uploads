import mongoose from "mongoose";

// Define the schema for the image model
const imageSchema = new mongoose.Schema({
  filename: String,
  fileId: String,
  contentType: String,
  uploadDate: Date,
});

// Create the image model based on the schema
const ImageModel = mongoose.model("Image", imageSchema);

export default ImageModel;
