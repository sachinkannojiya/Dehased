const express = require("express");
const connectDB = require("./src/db/connect");
const app = express();
const cors = require("cors");
const authRouter = require("./src/routes/auth");

app.use(cors());
app.use(express.json());
app.use("/api", authRouter);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB('mongodb://0.0.0.0:27017/deHashed');
    app.listen(port, () => {
         console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
      console.error("Error starting server:", error);
      process.exit(1); // Exit the process with a failure code
  }
};

start();
