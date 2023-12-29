const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

  const PORT = process.env.PORT || 2000;

const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

require("dotenv").config();

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();
const store = new mongoDBStore({
  uri: process.env.DB_URL,
  collection: "sessions",
});

const csrfProtection = csrf();
app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret key",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection);
app.use(flash())

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req,res,next)=>{
  res.locals.isAuthenticated= req.session.isLoggedIn,
  res.locals.csrfToken = req.csrfToken()
  next();
})

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);


app.use(errorController.get404);

mongoose
  .connect(process.env.DB_URL)
  .then((result) => {
    console.log('db connected')
  })
  .catch((err) => {
    console.log(err);
  });
  app.listen(PORT);

  module.exports = app;
