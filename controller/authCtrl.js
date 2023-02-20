const TenantSchema = require("../models/tenantSchema");
const EmployeeSchema = require("../models/employeeSchema.js");
const { switchDB, getDBModel } = require("../services/db.js");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const TenantSchemas = new Map([["tenant", TenantSchema]]);

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const tenantDB = await switchDB("AppTenants", TenantSchemas);
  const tenantModel = await getDBModel(tenantDB, "tenant");

  const tenant = await tenantModel.findOne({ email });
  if (!tenant) {
    return res.status(404).json({
      message: "You are not yet registered to our system",
    });
  }
  if (await bcrypt.compare(password, tenant.password)) {
    const token = jwt.sign(
      {
        id: tenant.id,
        name: tenant.name,
        email: tenant.email,
        role: tenant.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.status(201).json({ message: "Login successful", token });
  }
  return res.status(401).json({ message: "Invalid password" });
};

exports.refreshToken = async(req,res)=>{
   const tenant = req.tenant;
   const token = jwt.sign({ tenant }, process.env.JWT_SECRET, {
     expiresIn: "1h",
   });
  return res.json({ token });
}
