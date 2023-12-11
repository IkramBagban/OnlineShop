const getDb = require("../util/database").getDb;

class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  save() {
    const db = getDb();
    console.log(db)
    return db.collection("products")
      .insertOne(this) // jo instance se ham save function call karenge wo instance insert hojayenga database me.
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }
}

module.exports = Product;