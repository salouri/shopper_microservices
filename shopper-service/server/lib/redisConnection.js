const redis = require("@redis/client");
const config = require("../config");

const log = config.log();

const connectToRedis = (options) => {
  const client = redis.createClient(options);

  client.on("connect", () => {
    log.info("Connected to Redis");
  });

  client.on("error", (error) => {
    log.error("Error connecting to Redis:", error);
    process.exit(1);
  });

  return client;
};

module.exports = connectToRedis;
