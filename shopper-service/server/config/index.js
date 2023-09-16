// Import the package.json file to grab the package name and the version
const bunyan = require("bunyan");
const pkg = require("../../package.json");

const loggers = {
  development: () =>
    bunyan.createLogger({ name: "development", level: "debug" }),
  production: () => bunyan.createLogger({ name: "production", level: "info" }),
  test: () => bunyan.createLogger({ name: "test", level: "fatal" })
};
// Export a configuration object
module.exports = {
  // Use the name field from package.json as the application name
  serviceName: pkg.name,
  serviceVersion: pkg.version,

  registry: {
    url: "http://localhost:3080",
    version: "*"
  },

  // MongoDB configuration
  mongodb: {
    // Connection URL for the MongoDB server
    url: "mongodb://localhost:37017/shopper"
  },

  // Redis configuration
  redis: {
    // Connection options for the Redis server
    options: {
      // Connection URL for the Redis server
      url: "redis://localhost:7379"
    },
    // Placeholder for the Redis client, to be connected elsewhere
    client: null
  },
  jwt: {
    secret: "my secret key" // must match the secret key in user service
  },
  queue: {
    url: "amqp://127.0.0.1",
    name: "orders"
  },
  log: loggers[process.env.NODE_ENV || "development"] // log level based on NODE_ENV
};
