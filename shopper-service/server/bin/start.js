#!/usr/bin/env node
const http = require("http"); // HTTP server functionality
const axios = require("axios");
const cluster = require("cluster");

const totalCPUs = require("os").availableParallelism();
const config = require("../config"); // Configuration settings
const connectToMongoose = require("../lib/mongooseConnection"); // Function to connect to MongoDB
const app = require("../app"); // Express application
const tracing = require("../lib/tracing");

/* eslint-disable import/order */
const log = config.log();

// Create the HTTP server with the express app
const server = http.createServer(app);
const port = process.env.PORT || "3000";

if (cluster.isPrimary) {
  // Fork workers:

  // eslint-disable-next-line no-restricted-syntax, guard-for-in, no-plusplus
  for (let i = 0; i < totalCPUs; i++) cluster.fork();

  cluster.on("exit", (worker, code, signal) => {
    log.info(`worker ${worker.process.pid} died`);

    log.info("Let's fork another worker!");
    cluster.fork();
  });
} else {
  // eslint-disable-next-line no-unused-vars
  tracing(`${config.serviceName}:${config.serviceVersion}`);
  // Import necessary dependencies

  // Set the port from the environment variable or use 3000 as default

  // Attach a listening handler
  server.on("listening", () => {
    const addr = server.address();
    const bind =
      typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
    log.info(
      `${config.serviceName}:${config.serviceVersion} listening on ${bind}`
    );

    const register = async () => {
      try {
        await axios.put(
          `http://127.0.0.1:3080/registry/${config.serviceName}/${
            config.serviceVersion
          }/${server.address().port}`
        );
      } catch (error) {
        log.error(error.message);
      }
    };

    const unregister = async () => {
      try {
        await axios.delete(
          `http://127.0.0.1:3080/registry/${config.serviceName}/${
            config.serviceVersion
          }/${server.address().port}`
        );
      } catch (error) {
        log.error(error.message);
      }
    };

    const cleanup = async (intervalID) => {
      clearInterval(intervalID);
      await unregister();
    };

    register();
    const intervalId = setInterval(register, 10000);

    process.on("uncaughtException", async () => {
      await cleanup(intervalId);
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      await cleanup(intervalId);
      process.exit(0);
    });
    process.on("SIGINT", async () => {
      await cleanup(intervalId);
      process.exit(0);
    });
  });

  // Connect to Redis and MongoDB before starting the server
  config.redis.client.connect().then(() => {
    connectToMongoose(config.mongodb.url).then(() => server.listen(port));
  });
}
