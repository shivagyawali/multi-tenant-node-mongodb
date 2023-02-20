const mongoose =require('mongoose')

const employeeSchema = mongoose.Schema({
  name: {
    type: String,
  },
  companyName: {
    type: String,
  },
})
module.exports = employeeSchema;

