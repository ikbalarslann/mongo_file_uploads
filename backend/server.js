import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import chalk from "chalk";
import dotenv from "dotenv";
import imageRoutes from "./routes/imageRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 5000;

connectDB();

// Middleware
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

app.use("/", imageRoutes);

app.listen(port, () =>
  console.log(chalk.green(`Server started on port ${port}`))
);
