const path = require("path");
const express = require("express");

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const errorController = require("./controllers/error");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
      const USER = { username: "ikram", email: "bagbanikram@gmail.com" };
      req.user = USER;
      next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Server is running on the PORT", 2000);
    app.listen(2000);
  })
  .catch((err) => console.log(err));
