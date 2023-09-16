const pkg = require("./package.json");

module.exports = {
  serviceName: pkg.name,
  serviceVersion: pkg.version,
  mongodb: {
    url: "mongodb://localhost:37017/shopper"
  },
  redis: {
    options: {
      url: "redis://localhost:7379"
    },
    client: null
  },
  jwt: {
    secret: "my secret key" // must match the key in user service
  },
  queue: {
    url: "amqp://127.0.0.1",
    name: "orders"
  }
};
