const path = require("path");
const express = require("express");

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const User = require("./models/user");

const errorController = require("./controllers/error");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  console.log('user');
  User.findById("65806c272c1279a21240f881")
    .then((user) => {
      req.user = user;
      console.log(user);
    })
    .catch((err) => console.log(err));
    next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Ikram",
          email: "bagbanikram@gmail.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });

    app.listen(2000);
  })
  .catch((err) => console.log(err));
