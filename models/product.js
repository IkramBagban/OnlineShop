const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: {
    type: String, 
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

// Exporting the Mongoose model 'Product' created from the 'ProductSchema'.
// Mongoose, by default, pluralizes the singular model name 'Product' by adding an 's' at the end ('Products') when creating the corresponding collection in the database.
module.exports = mongoose.model('Product', ProductSchema)