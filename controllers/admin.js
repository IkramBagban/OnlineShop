const product = require("../models/product");
const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  console.log("working");
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  // Creating a new instance of the 'Product' model by passing an object as a parameter.
  // The keys of this object correspond to the defined keys in the 'ProductSchema'.
  // The values represent the data we want to save in the database.
  // _id is not provided because _id is created automatically by mongoose
  const product = new Product({
    title: title,
    description: description,
    imageUrl: imageUrl,
    price: price,
  });
  product
    .save() // this save method is provided by mongoose
    .then(() => {
      console.log("Product Created");
      res.redirect("/admin/products");
    })
    .catch((e) => console.log("Got An Error While Creating A Product", e));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((e) => console.log(e));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  // steps to update the product.
  // step 1 : first find the product using findById method.
  // it returns the product. in then block we can get product
  // step 2 : update the product 
  // step 3 : call save method

  Product.findById(prodId)
    .then((product) => {
      // Update product properties
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDesc;
      product.save(); // saving the updated product.
      
    })
    .then((result) => {
      console.log("PRODUCT UPDATED");
      res.redirect("/admin/products");
    })
    .catch((e) => console.log(e));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((e) => console.log(e));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  // find by id and delete is provided by mongoose which deletes the product
  Product.findByIdAndDelete(prodId)
    .then((result) => {
      console.log("Product Has Been Deleted");
      res.redirect("/admin/products");
    })
    .catch((e) => console.log("Got An Error While Deleting Product", e));
};
