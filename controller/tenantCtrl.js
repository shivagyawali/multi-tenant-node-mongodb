const TenantSchema = require("../models/tenantSchema");
const EmployeeSchema = require("../models/employeeSchema.js");
const { switchDB, getDBModel } = require("../services/db.js");

const EmployeeSchemas = new Map([["employee", EmployeeSchema]]);
const TenantSchemas = new Map([["tenant", TenantSchema]]);

exports.getAllTenant = async (req, res) => {
  const tenantDB = await switchDB("AppTenants", TenantSchemas);
  const tenantModel = await getDBModel(tenantDB, "tenant");
  const tenants = await tenantModel.find({});
  res.json(tenants);
};

exports.create = async (req, res) => {
  const tenantId = req.params.tenantId;
  const tenantDB = await switchDB("AppTenants", TenantSchemas);
  const tenantModel = await getDBModel(tenantDB, "tenant");
  const tenant = await tenantModel.findOne({ id: tenantId });
  const companyDB = await switchDB(tenant.companyName, EmployeeSchemas);
  const employeeModel = await getDBModel(companyDB, "employee");
  const { name } = req.body;
  const employee = await employeeModel.create({
    name,
    companyName: tenant.companyName,
  });
  res.status(201).json(employee);
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
    const companyDB = await switchDB(tenant.companyName, EmployeeSchemas);

    if (companyDB) {
      await companyDB.dropDatabase();
      return res.send("Tenant and database deleted successfully");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};
