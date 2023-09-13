const express = require("express");
const CatalogService = require("../lib/CatalogService");

const router = express.Router();

// Define a filter for responses
function filterResponse(itemObj) {
  return {
    id: itemObj.id,
    price: itemObj.price,
    sku: itemObj.sku,
    name: itemObj.name
  };
}
// Define your RESTful routes here
router.get("/items", async (req, res) => {
  try {
    const items = await CatalogService.getAll();
    return res.json(items.map((item) => filterResponse(item)));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/items/:id", async (req, res) => {
  try {
    const item = await CatalogService.getOne(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Item not found." });
    }
    return res.json(filterResponse(item));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/items", async (req, res) => {
  try {
    const item = await CatalogService.create(req.body);
    return res.status(201).json(item);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/items/:id", async (req, res) => {
  try {
    const item = await CatalogService.update(req.params.id, req.body);
    if (!item) {
      return res.status(404).json({ error: "Item not found." });
    }
    return res.json(filterResponse(item));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/items/:id", async (req, res) => {
  try {
    const deleteResult = await CatalogService.remove(req.params.id);
    if (!deleteResult.deletedCount) {
      return res.status(404).json({ error: "Item not found." });
    }
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
