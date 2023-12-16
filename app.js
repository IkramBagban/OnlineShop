const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const User = require("./models/user");
const errorController = require("./controllers/error");

const mongoConnect = require("./util/database").mongoConnect;

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("657d7d1e437fd6aa816d5170")
    .then((user) => {
      const USER = new User(user.name, user.email, user.cart, user._id)
      req.user = USER;
      next();
    })
    .catch((err) => console.log(err));
});


app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(2000);
});
