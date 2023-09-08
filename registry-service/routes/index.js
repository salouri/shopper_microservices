const express = require("express");

const router = express.Router();

// Define your RESTful routes here
router.put(
  "/registery/:servicename/:serviceversion/:serviceport",
  (req, res, next) => {
    return next("Not implemented");
  }
);

router.delete(
  "/registery/:servicename/:serviceversion/:serviceport",
  (req, res, next) => {
    return next("Not implemented");
  }
);

router.get("/registery/:servicename/:serviceversion", (req, res, next) => {
  return next("Not implemented");
});
module.exports = router;
