  const path = require("path");

  const express = require("express");
  const bodyParser = require("body-parser");
  const mongoose = require("mongoose");
  const session = require("express-session");
  const MongoDBStore = require("connect-mongodb-session")(session);
  const csrf = require("csurf");
  const flash = require("connect-flash");
  const multer = require("multer");
  require("dotenv").config();
  const PORT = 2000;

  const errorController = require("./controllers/error");
  const User = require("./models/user");

  const app = express();
  const store = new MongoDBStore({
    uri: process.env.DB_URL,
    collection: "sessions",
  });
  const csrfProtection = csrf();

  const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, "images");
    },
    filename: (req, file, callback) => {
      callback(null, `${Math.random()*10000+100000}-${file.originalname}`);
    },
  });

  const fileFilter = (req, file, callback) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  };

  app.set("view engine", "ejs");
  app.set("views", "views");

  const adminRoutes = require("./routes/admin");
  const shopRoutes = require("./routes/shop");
  const authRoutes = require("./routes/auth");

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(
    multer({
      storage: fileStorage,
      fileFilter : fileFilter,
    }).single("image")
  );
  app.use(express.static(path.join(__dirname, "public")));
  app.use('/images',express.static(path.join(__dirname, "images")));
  app.use(
    session({
      secret: "my secret",
      resave: false,
      saveUninitialized: false,
      store: store,
    })
  );
  app.use(csrfProtection);
  app.use(flash());

  app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
  });

  app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    User.findById(req.session.user._id)
      .then((user) => {
        if (!user) {
          return next();
        }
        req.user = user;
        next();
      })
      .catch((err) => {
        next(new Error(err));
      });
  });

  app.use("/admin", adminRoutes);
  app.use(shopRoutes);
  app.use(authRoutes);

  app.get("/500", errorController.get500);

  app.use(errorController.get404);

  app.use((error, req, res, next) => {
    // if(!req.session?.isLoggedIn) return next();
    res.status(500).render("500", {
      pageTitle: "Error!",
      path: "/500",
      isAuthenticated: req.session.isLoggedIn,
    });
  });

  mongoose
    .connect(process.env.DB_URL)
    .then((result) => {
      app.listen(PORT);
      console.log("db connected");
    })
    .catch((err) => {
      console.log(err);
    });
