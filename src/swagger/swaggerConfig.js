import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "HIREPLAYER-APP ",
      version: "1.0.0",
      description: "HIREPLAYER-APP API",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["src/app.js", "src/routes/*.js"],
};

const specs = swaggerJsDoc(options);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
};

export default { setupSwagger };
