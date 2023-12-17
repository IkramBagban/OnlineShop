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

  Product.findById({ id: prodId })
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

  // Product.findByPk(prodId)
  //   .then((product) => {
  //     if (!product) {
  //       return res.redirect("/");
  //     }
  //     res.render("admin/edit-product", {
  //       pageTitle: "Edit Product",
  //       path: "/admin/edit-product",
  //       editing: editMode,
  //       product: product,
  //     });
  //   })
  //   .catch((e) => console.log(e));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  const product = new Product(
    updatedTitle,
    updatedPrice,
    updatedDesc,
    updatedImageUrl,
    prodId
  );

  product
    .save()
    .then((result) => {
      console.log("PRODUCT UPDATED");
      res.redirect("/admin/products");
    })
    .catch((e) => console.log(e));
};

exports.getProducts = (req, res, next) => {
  // using request.user.getProducts() instead of Model.findAll()
  Product.fetchAll()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((e) => console.log(e));
  // Product.findAll()
  //   .then((products) => {
  //     res.render("admin/products", {
  //       prods: products,
  //       pageTitle: "Admin Products",
  //       path: "/admin/products",
  //     });
  //   })
  //   .catch((e) => console.log(e));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.deleteById(prodId)
    .then((result) => {
      console.log("Product Has Been Deleted");
      res.redirect("/admin/products");
    })
    .catch((e) => console.log("Got An Error While Deleting Product", e));
};
