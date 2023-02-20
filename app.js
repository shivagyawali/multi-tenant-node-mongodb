const express =require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

app.use(express.json());
app.use(cors());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(`/tenants`, require("./routes/tenantRoutes"));
app.use(`/employees`, require("./routes/employeeRoutes"));


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
  console.log(
    `Documentation here: 🔥🔥🔥 👉 - http://localhost:${port}/docs`
  );
});
