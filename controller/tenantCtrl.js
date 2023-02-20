const TenantSchema = require("../models/tenantSchema");
const EmployeeSchema = require("../models/employeeSchema.js");
const { switchDB, getDBModel } = require("../services/db.js");
const bcrypt = require("bcrypt");

const EmployeeSchemas = new Map([["employee", EmployeeSchema]]);
const TenantSchemas = new Map([["tenant", TenantSchema]]);

exports.getAllTenant = async (req, res) => {
  const tenantDB = await switchDB("AppTenants", TenantSchemas);
  const tenantModel = await getDBModel(tenantDB, "tenant");
  const tenants = await tenantModel.find({}).select("-password");
  res.json(tenants);
};

exports.create = async (req, res) => {
  const { name, email, password, companyName } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const tenantDB = await switchDB("AppTenants", TenantSchemas);
  const tenantModel = await getDBModel(tenantDB, "tenant");
  const cName = companyName.replace(/\s+/g, "-").toLowerCase();
  const tenant = await tenantModel.findOne({
    email: email,
    companyName: companyName,
  });
  if (tenant) {
    return res.json({
      message: "Tenant Already Exists",
    });
  } else {
     const createdTenant = await tenantModel.create({
       companySlug: cName,
       password: hashedPassword,
       name:name,
       email:email,
       companyName:companyName
     });
    //create new db for tenant
    await switchDB(createdTenant.companySlug, EmployeeSchemas);

    return res.status(201).json({ message: "Company tenant created successfully" });;
  }
};

exports.destroy = async (req, res) => {
  const { id } = req.params.id;
  try {
    // Find the tenant to be deleted
    const tenantDB = await switchDB("AppTenants", TenantSchemas);
    const tenantModel = await getDBModel(tenantDB, "tenant");
    const tenant = await tenantModel.findOne({ id: id });
    if (!tenant) {
      return res.status(404).send("Tenant not found");
    }
    //   // Delete the tenant from the app tenants collection
    await tenant.deleteOne();

    //   // Drop the corresponding company database
    const companyDB = await switchDB(tenant.companySlug, EmployeeSchemas);

    if (companyDB) {
      await companyDB.dropDatabase();
      return res.send("Tenant and database deleted successfully");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};
