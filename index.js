import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./src/routes/auth-routes.js";
import errorMiddleware from "./src/middlewares/error-middleware.js";
import contactsRoutes from "./src/routes/contact-routes.js";
import setupSocket from "./socket.js";
import messageRoutes from "./src/routes/messages-route.js";
import channelRoutes from "./src/routes/channel-routes.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 2001;
const databaseURL = process.env.DATABASE_URL;

app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/channel", channelRoutes);
app.use(errorMiddleware);

const connectDB = async () => {
  try {
    await mongoose.connect(databaseURL);

    console.log("Success connect to DB");
  } catch (error) {
    console.log(error);
  }
};

const server = app.listen(port, () => {
  connectDB();

  console.log("Server is running in port " + port);
});

setupSocket(server);
