const TenantSchema = require("../models/tenantSchema");
const EmployeeSchema = require("../models/employeeSchema.js");
const { switchDB, getDBModel } = require("../services/db.js");

const EmployeeSchemas = new Map([["employee", EmployeeSchema]]);
const TenantSchemas = new Map([["tenant", TenantSchema]]);

const getAllTenants = async (req, res) => {
  const tenantDB = await switchDB("AppTenants", TenantSchemas);
  const tenantModel = await getDBModel(tenantDB, "tenant");
  const tenants = await tenantModel.find({});
 return  tenants;
};

exports.getAllEmployee = async (req, res) => {
  const customers = await getAllTenants();
  const mapCustomers = customers.map(async (tenant) => {
    const companyDB = await switchDB(tenant.companyName, EmployeeSchemas);
    const employeeModel = await getDBModel(companyDB, "employee");
    return employeeModel.findMany({});
  });
  const results = await Promise.all(mapCustomers);
 return res.json({
    results,
    count:results.length
  });
};

exports.create = async (req, res) => {
  try {
    // Create new tenant in AppTenants database
    const tenantDB = await switchDB("AppTenants", TenantSchemas);
    const tenant = await getDBModel(tenantDB, "tenant");
    const newTenant = await tenant.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      companyName: req.body.companyName,
    });

    // Create new employee in company database for the new tenant
    const companyDB = await switchDB(newTenant.companyName, EmployeeSchemas);
    const employeeModel = await getDBModel(companyDB, "employee");
    const newEmployee = await employeeModel.create({
      name: req.body.employeeName,
      companyName: req.body.companyName,
    });

    // Return success message with new tenant and employee details
    res.status(201).json({
      message: "New tenant and employee created successfully",
      newTenant,
      newEmployee,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating tenant and employee" });
  }
};
