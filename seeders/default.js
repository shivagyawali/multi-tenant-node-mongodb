const TenantSchema = require("../models/tenantSchema");
const EmployeeSchema = require("../models/employeeSchema.js");
const { switchDB, getDBModel } = require("../services/db.js");

const EmployeeSchemas = new Map([["employee", EmployeeSchema]]);
const TenantSchemas = new Map([["tenant", TenantSchema]]);

async function defaultSeed() {
  try {
    const tenantDB = await switchDB("AppTenants", TenantSchemas);
    const tenant = await getDBModel(tenantDB, "tenant");
    await tenant.deleteMany({});
    const tenantA = await tenant.create({
      name: "Steve",
      email: "Steve@example.com",
      password: "secret",
      companyName: "Apple",
    });
    const tenantB = await tenant.create({
      name: "Bill",
      email: "Bill@example.com",
      password: "secret",
      companyName: "Microsoft",
    });
    const tenantC = await tenant.create({
      name: "Jeff",
      email: "Jeff@example.com",
      password: "secret",
      companyName: "Amazon",
    });

    const customers = await tenant.find({});
    const createEmployees = customers.map(async (tenant) => {
      const companyDB = await switchDB(tenant.companyName, EmployeeSchemas);
      const employeeModel = await getDBModel(companyDB, "employee");
      await employeeModel.deleteMany({});
      return employeeModel.create({
        name: "John",
        companyName: tenant.companyName,
      });
    });
    const results = await Promise.all(createEmployees);
    console.log("Tenants and employees initialized successfully");
  } catch (error) {
    console.error(error);
  }
}
defaultSeed();
