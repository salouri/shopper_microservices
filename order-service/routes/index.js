const express = require("express");
const requireAdmin = require("../lib/requireAdmin");
const OrderService = require("../lib/OrderService");

const router = express.Router();

function filterResponse(order) {
  return {
    id: order.id,
    userId: order.userId,
    email: order.email,
    sku: order.sku,
    status: order.status,
    items: order.items
  };
}

router.get("/orders", async (req, res) => {
  try {
    const orders = await OrderService.getAll();
    return res.json(orders.map(filterResponse));
  } catch (error) {
    console.error(error);
    throw error;
  }
});

router.post("/orders", requireAdmin, async (req, res) => {
  try {
    const order = await OrderService.create(
      req.body.userId,
      req.body.email,
      req.body.items
    );
    if (!order) {
      res.status(404).send("Error creating order");
    } else {
      res.json(filterResponse(order));
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("General error");
  }
});

router.put("/orders/:id", requireAdmin, async (req, res) => {
  try {
    const updatedOrder = await OrderService.setStatus(
      req.params.id,
      req.body.status
    );
    if (!updatedOrder) return res.status(404).send("Order not found");
    return res.json(filterResponse(updatedOrder));
  } catch (error) {
    console.error(error);
    return res.status(500).send("General error");
  }
});

module.exports = router;
