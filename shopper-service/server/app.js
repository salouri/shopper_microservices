// Import necessary dependencies
const express = require("express");
const compression = require("compression");
const path = require("path");
const session = require("express-session");
const morgan = require("morgan");
const RedisStore = require("connect-redis").default;
const helmet = require("helmet");
const { assignTemplateVariables } = require("./lib/middlewares");
const routeHandler = require("./routes");
const config = require("./config");
const connectToRedis = require("./lib/redisConnection"); // Function to connect to Redis

// Prepare the Redis client to connect to later
// This has to come before `app` is initiated because sessions depend on it
config.redis.client = connectToRedis(config.redis.options);

// Initialize express application
const app = express();
app.use(compression());

// Set up view engine (Pug in this case) and views directory
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Set up middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("tiny")); // Log HTTP requests
app.use(express.static(path.join(__dirname, "../client"))); // Serve static files

// Initialize Redis session store
const redisStore = new RedisStore({
  client: config.redis.client,
  prefix: "shopper_session:"
});
// Set up session middleware

if (app.get("env") === "production") {
  app.set("trust proxy", "loopback");
  app.use(
    session({
      store: redisStore,
      secret: "another secret for production",
      resave: true,
      saveUninitialized: false,
      name: "sessionId",
      proxy: true,
      cookie: { secure: true }
    })
  );
} else {
  app.use(
    session({
      store: redisStore,
      secret: "CHANGE ME!",
      resave: false,
      saveUninitialized: false
    })
  );
}
// Ignore requests for favicon and robots.txt
app.get("/favicon.ico", (req, res) => res.status(204));
app.get("/robots.txt", (req, res) => res.status(204));

// Middleware to add 'global' template variables
app.use(assignTemplateVariables);

// Set up routes
app.use("/", routeHandler);

// Error handlers
app.use((req, res, next) => {
  const err = new Error(`Not Found (${req.url})`);
  err.status = 404;
  next(err);
});

app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

// Export the express application
module.exports = app;
