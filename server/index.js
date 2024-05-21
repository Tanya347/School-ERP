import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";

//import route
import adminRoute from "./routes/admin.js";
import facultyRoute from "./routes/faculty.js";
import studentRoute from "./routes/student.js";
import taskRoute from "./routes/tasks.js";
import updateRoute from "./routes/updates.js";
import eventRoute from "./routes/events.js";
import queryRoute from "./routes/queries.js";
import courseRoute from "./routes/course.js";
import testRoute from "./routes/test.js";
import classRoute from "./routes/class.js";
import countAllRoute from "./routes/countDocuments.js";

// import resultRoute from "./routes/result.js";

//config and middlewares
const app = express();
dotenv.config();
app.use(
  cors({
    origin: "http://localhost:3000",
    credential: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong";
  res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

const PORT = process.env.PORT || 5500;

// mongoose connection

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

//routes

app.use("/api/admins", adminRoute);
app.use("/api/faculties", facultyRoute);
app.use("/api/students", studentRoute);
app.use("/api/tasks", taskRoute);
app.use("/api/updates", updateRoute);
app.use("/api/events", eventRoute);
app.use("/api/queries", queryRoute);
app.use("/api/courses", courseRoute);
app.use("/api/tests", testRoute);
app.use("/api/classes", classRoute);
app.use("/api", countAllRoute);


//listen on port

app.listen(PORT, () => {
  console.log("Listening on port 5500");
  connect();
});
