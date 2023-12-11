const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const mongoConnect = async (callback) => {
  MongoClient.connect(process.env.DB_URL)
    .then((client) => {
      callback(client);
      console.log("connected!");
    })
    .catch((err) => console.log(err));
};


module.exports = mongoConnect;