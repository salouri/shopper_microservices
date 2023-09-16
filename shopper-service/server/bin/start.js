#!/usr/bin/env node
const axios = require("axios");
const config = require("../config"); // Configuration settings

/* eslint-disable import/order */

// Import necessary dependencies
// HTTP server functionality

const log = config.log();

// eslint-disable-next-line no-unused-vars
const tracing = require("../lib/tracing")(
  `${config.serviceName}:${config.serviceVersion}`
);
// Import necessary dependencies
const http = require("http"); // HTTP server functionality

const connectToMongoose = require("../lib/mongooseConnection"); // Function to connect to MongoDB
const connectToRedis = require("../lib/redisConnection"); // Function to connect to Redis

// Prepare the Redis client to connect to later
// This has to come before `app` is initiated because sessions depend on it
config.redis.client = connectToRedis(config.redis.options);

const app = require("../app"); // Express application

// Set the port from the environment variable or use 3000 as default
const port = process.env.PORT || "3000";

// Create the HTTP server with the express app
const server = http.createServer(app);

// Attach a listening handler
server.on("listening", () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
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
