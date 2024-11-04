import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import ExpressMongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";

import { errorHandler } from "./utils/errorHandler.js";
import { AppError } from "./utils/customError.js";
import {rateLimit} from "express-rate-limit";

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
import attendanceRoute from "./routes/attendance.js";
import authRoute from "./routes/auth.js"
import countAllRoute from "./routes/countDocuments.js";

process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  process.exit(1);
})

const app = express();
dotenv.config();

app.use(express.json({limit: '10kb'}));
app.use(cookieParser());
app.use(helmet());
app.use(morgan("common"));
app.use(
  cors({
    origin: process.env.CLIENT,
    credentials: true,
  })
);
if(process.env.NODE_ENV === 'development')
  app.use(morgan("common"));
app.use(ExpressMongoSanitize());
app.use(xss());
app.use(hpp());
const limiter = rateLimit({
  max: 100,
  windowMs: 60*60*1000,
  message: "Too many requests, please try again in an hour!",
})

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

const connect = async () => {
  try {
    mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});


app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

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
app.use("/api/attendances", attendanceRoute);
app.use("/api/auth", authRoute);
app.use("/api", countAllRoute);

// unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})

// error handling middleware
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
  connect();
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting down...');
  server.close(() => {
    process.exit(1);
  })
})
