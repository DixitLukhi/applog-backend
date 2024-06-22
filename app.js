require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");
const authRoutes = require("./routes/auth");
const guidelineRoutes = require("./routes/guideline");
const appRoutes = require("./routes/apps");
const imageRoutes = require("./routes/image");

const app = express();

app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
  })
);

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());

// app.use(cors());
app.use(
  cors({
    origin: "https://applog-backend.onrender.com",
    methods: "GET, POST, DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// DB connnection
mongoose.set("runValidators", true);

mongoose
  .connect(process.env.MONGO_CONNECT, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => console.log("DB CONNECTED."))
  .catch((err) => console.log("Can't connect", err));

// Routes
app.use("/api", authRoutes);
app.use("/api", guidelineRoutes);
app.use("/api", appRoutes);
app.use("/api", imageRoutes);

//  PORT
const port = process.env.PORT || 1234;

//  Starting a server
app.listen(port, () => {
  return console.log(`App is running at port ${port}`);
});
