import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import {
  getAllImages,
  createImage,
  getAllFilesJson,
  getSingleFile,
  getImage,
  deleteFile,
} from "../controllers/imageController.js";

const router = express.Router();

//image
router.get("/", getAllImages);
router.post("/upload", upload.single("file"), createImage);
router.get("/image/:filename", getImage);

//file
router.get("/files", getAllFilesJson);
router.get("/files/:filename", getSingleFile);
router.delete("/files/:id", deleteFile);

export default router;
