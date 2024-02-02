const express = require("express");
const dotenv = require("dotenv");
const dbConnect = require("./dbConnect");
const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const postRouter = require("./routers/postRouter");
const cloudinary = require("cloudinary").v2;

dotenv.config("./.env");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
//middlewares

app.use(
  express.json({
    limit: "10mb",
  })
);
app.use(morgan("common"));
app.use(cookieParser());
app.use(cors());
app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use("/user", userRouter);
app.get("/", (req, res) => {
  res.status(200).send("ok from server");
});
const PORT = process.env.PORT || 4001;
dbConnect();
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
