const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  // _id is not provided because _id is created automatically by mongoose

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
  userId : {
    type : Schema.Types.ObjectId,
    ref : 'User',
    required : true
  }
});

// Exporting the Mongoose model 'Product' created from the 'ProductSchema'.
// mongoose takes model name here is product, turns it to all lowercase and takes the plural form of that name
// and then it is being used as a collection name,
module.exports = mongoose.model("Product", ProductSchema);
