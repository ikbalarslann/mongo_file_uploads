import mongoose from "mongoose";

// Define the schema for the image model
const imageSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  uploadDate: Date,
  // Add other fields as needed
});

// Create the image model based on the schema
const ImageModel = mongoose.model("Image", imageSchema);

export default ImageModel;
