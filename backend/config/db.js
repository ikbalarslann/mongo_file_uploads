import mongoose from "mongoose";
import chalk from "chalk";
import Grid from "gridfs-stream";

let gfs;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("uploads");

    console.log(
      `${chalk.green("✓")} ${chalk.blue(`MongoDB Connected: `)}${
        conn.connection.host
      }`
    );
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export { gfs };

export default connectDB;
