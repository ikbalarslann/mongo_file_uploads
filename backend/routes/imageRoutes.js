import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import {
  getAllFiles,
  uploadFile,
  getAllFilesJson,
  getSingleFile,
  getImage,
  deleteFile,
} from "../controllers/imageController.js";

const router = express.Router();

router.get("/", getAllFiles);
router.post("/upload", upload.single("file"), uploadFile);
router.get("/files", getAllFilesJson);
router.get("/files/:filename", getSingleFile);
router.get("/image/:filename", getImage);
router.delete("/files/:id", deleteFile);

export default router;
