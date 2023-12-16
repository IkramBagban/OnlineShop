const { ObjectId } = require("mongodb");
const { getDb } = require("../util/database");

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();

    return db
      .collection("users")
      .insertOne()
      .then((result) => console.log("user has been created"))
      .catch((err) => console.log(err));
  }

  addToCart(product) {
    const db = getDb();
    console.log("carts", this);

    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity,
      });
    }
    const updatedCart = { items: updatedCartItems };
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    const db = getDb();

    const productIds = this.cart.items.map((item) => item.productId);

    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((p) => {
          return {
            ...p,
            quantity: this.cart.items.find(
              (i) => i.productId.toString() === p._id.toString()
            ).quantity,
          };
        });
      });
  }

  deleteItemFromCart(productId) {
    console.log("befroe", this.cart.items);

    const updatedCartItems = this.cart.items.filter(
      (item) => item.productId.toString() !== productId.toString()
    );

    const db = getDb();

    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  addOrder() {
    console.log(".... adding order.....................................................")
    const db = getDb();

    return db
      .collection("orders")
      .insertOne(this.cart)
      .then((result) => {
        this.cart = { items: [] };
        return db
          .collection("users")
          .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: { items: {} } } }
          );
      });
  }

  static findById(prodId) {
    const db = getDb();

    return db
      .collection("users")
      .findOne({ _id: new ObjectId(prodId) })
      .then((user) => {
        console.log("user", user);
        return user;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = User;
