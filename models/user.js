const { ObjectId } = require("mongodb");
const { getDb } = require("../util/database");

class User {
  constructorr(username, email) {
    this.username = username;
    this.email = this.email;
  }

  save() {
    const db = getDb();

    return db
      .collection("users")
      .insertOne()
      .then((result) => console.log("user has been created"))
      .catch((err) => console.log(err));
  }

  static findById(prodId) {
    const db = getDb();

    return db.collection("users").findOne({ _id: ObjectId(prodId) });
  }
}

module.exports = User;
