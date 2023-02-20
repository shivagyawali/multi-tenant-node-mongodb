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

  const employeePromises = customers.map(async (tenant) => {
    const employeeDB = await switchDB(tenant.companySlug, EmployeeSchemas);
    const employeeModel = await getDBModel(employeeDB, "employee");
    return employeeModel.find();
  });

  const results = await Promise.all(employeePromises)
return res.json(results);
};

exports.create = async (req, res) => {
  const tenantId = req.params.tenantId;
  const {name} = req.body
  try {
    // Create new tenant in AppTenants database
    const tenantDB = await switchDB("AppTenants", TenantSchemas);
    const tenant = await getDBModel(tenantDB, "tenant");
    const tenantModel = await tenant.findById(tenantId);

  if (!tenantModel) {
    return res.json({
      message: "Create Tenant first",
    });
  }

   //Create new employee in company database for the new tenant
    const employeeDB = await switchDB(tenantModel.companySlug, EmployeeSchemas);
    const employeeModel = await getDBModel(employeeDB, "employee");
    
    const newEmployee = await employeeModel.create({
      name: name,
      companyName: tenantModel.companyName,
    });

    // Return success message with new tenant and employee details
    res.status(201).json({
      message: "New tenant and employee created successfully",
      newEmployee,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating tenant and employee" });
   }
};
