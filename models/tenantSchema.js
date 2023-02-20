const mongoose = require("mongoose");

const tenantSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  companyName: {
    type: String,
    unique: true,
  },
  companySlug: {
    type: String,
    trim:true,
    unique: true,
  },
});

module.exports = tenantSchema;
