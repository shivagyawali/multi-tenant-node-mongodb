const TenantSchema = require("../models/tenantSchema");
const EmployeeSchema = require("../models/employeeSchema.js");
const { switchDB, getDBModel } = require("../services/db.js");

const EmployeeSchemas = new Map([["employee", EmployeeSchema]]);
const TenantSchemas = new Map([["tenant", TenantSchema]]);
const { faker } =require("@faker-js/faker");
async function defaultSeed() {
  try {
    const tenantDB = await switchDB("AppTenants", TenantSchemas);
    const tenant = await getDBModel(tenantDB, "tenant");
    await tenant.deleteMany({});
    const tenantA = await tenant.create({
      _id: "63f32c4f05a3720b0e8dbc3c",
      name: "Shashank Adhikari",
      email: "shashank@gmail.com",
      password: "shashank123",
      companyName: "Tech Temple It Solutions",
      companySlug: "tech-temple-it-solutions",
      __v: 0,
    });
    const tenantB = await tenant.create({
      _id: "63f33100187bcbb7a07f3d85",
      name: "Sandeep Neupane",
      email: "sandeep@gmail.com",
      password: "sandeep123",
      companyName: "Lumbini Tech",
      companySlug: "lumbini-tech",
      __v: 0,
    });
   

    const customers = await tenant.find({});
    const createEmployees = customers.map(async (tenant) => {
      const companyDB = await switchDB(tenant.companySlug, EmployeeSchemas);
      const employeeModel = await getDBModel(companyDB, "employee");
      await employeeModel.deleteMany({});
      return employeeModel.create({
        name: faker.name.fullName(),
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
