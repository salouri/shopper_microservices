const express = require("express");
const morgan = require("morgan");
const amqp = require("amqplib");
const config = require("./config");
const OrderService = require("./lib/OrderService");
const routes = require("./routes");

const app = express();
app.use(compression());
// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to log HTTP requests
app.use(morgan("tiny"));

// Mount the router
app.use("/", routes);
// Error handling middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  // You can also log the error to a file or console
  console.error(err);

  res.status(status).json({
    error: {
      message,
      status
    }
  });
});
module.exports = app;

(async () => {
  try {
    const connection = await amqp.connect(config.queue.url);
    const channel = await connection.createChannel();
    const queueName = config.queue.name;
    await channel.assertQueue(queueName, { durable: true });
    console.log(' [x] Waiting for message in "%s" queue', queueName);

    channel.consume(
      queueName,
      async (message) => {
        const order = JSON.parse(message.content.toString());
        console.log(" [x] Received %s", JSON.stringify(order));
        await OrderService.create(order.userId, order.email, order.items);
        channel.ack(message);
      },
      { noAck: false }
    );
  } catch (err) {
    console.error(err);
  }
})();
