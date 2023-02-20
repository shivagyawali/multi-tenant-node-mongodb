const mongoose = require("mongoose");
const dotenv =require("dotenv");
dotenv.config();
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
 
};

function connectDB() {
  return new Promise((resolve, reject) => {
    const mongoURL = `mongodb://127.0.0.1:${process.env.MONGO_PORT}`;
    mongoose.set("strictQuery", false);
    mongoose
      .connect(mongoURL, mongoOptions)
      .then((conn) => {
        console.log(`connected to ${mongoURL}`);
        resolve(conn);
      })
      .catch((error) => reject(error));
  });
}

module.exports=connectDB;
