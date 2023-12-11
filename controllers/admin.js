const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  console.log("working")
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

  
  req.user
    .createProduct({ // user and product k beech me relation define kare baad. ye function se product create kare to userId auto add horahi
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
    })
    .then(() => {
      console.log("Product Created");
      res.redirect("/admin/products");
    })
    .catch((e) => console.log("Got An Error While Creating A Product", e));

  // Product.create({
  //   title: title,
  //   price: price,
  //   imageUrl: imageUrl,
  //   description: description,
  // })
  //   .then(() => {
  //     console.log("Product Created");
  //     res.redirect("/admin/products");
  //   })
  //   .catch((e) => console.log("Got An Error While Creating A Product", e));
};

// exports.getEditProduct = (req, res, next) => {
//   const editMode = req.query.edit;
//   if (!editMode) {
//     return res.redirect("/");
//   }
//   const prodId = req.params.productId;

//   // to use req.user we have to set a middleware in app.js. and in this we will get getProducts method.
//   req.user.getProducts({where : {id:prodId}}).then((products) => {
//     const product = products[0];
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

//   // Product.findByPk(prodId)
//   //   .then((product) => {
//   //     if (!product) {
//   //       return res.redirect("/");
//   //     }
//   //     res.render("admin/edit-product", {
//   //       pageTitle: "Edit Product",
//   //       path: "/admin/edit-product",
//   //       editing: editMode,
//   //       product: product,
//   //     });
//   //   })
//   //   .catch((e) => console.log(e));
// };

// exports.postEditProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   const updatedTitle = req.body.title;
//   const updatedPrice = req.body.price;
//   const updatedImageUrl = req.body.imageUrl;
//   const updatedDesc = req.body.description;

//   Product.findByPk(prodId)
//     .then((product) => {
//       product.title = updatedTitle;
//       product.price = updatedPrice;
//       product.imageUrl = updatedImageUrl;
//       product.description = updatedDesc;
//       return product.save();
//     })
//     .then((result) => {
//       console.log("PRODUCT UPDATED");
//       res.redirect("/admin/products");
//     })
//     .catch((e) => console.log(e));
// };

// exports.getProducts = (req, res, next) => {

//   // using request.user.getProducts() instead of Model.findAll()
//   req.user.getProducts().then((products) => {
//     res.render("admin/products", {
//       prods: products,
//       pageTitle: "Admin Products",
//       path: "/admin/products",
//     });
//   })
//   .catch((e) => console.log(e));
//   // Product.findAll()
//   //   .then((products) => {
//   //     res.render("admin/products", {
//   //       prods: products,
//   //       pageTitle: "Admin Products",
//   //       path: "/admin/products",
//   //     });
//   //   })
//   //   .catch((e) => console.log(e));
// };

// exports.postDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;

//   Product.findByPk(prodId)
//     .then((product) => {
//       return product.destroy();
//     })
//     .then((result) => {
//       console.log("Product Has Been Deleted");
//       res.redirect("/admin/products");
//     })
//     .catch((e) => console.log("Got An Error While Deleting Product", e));
// };
