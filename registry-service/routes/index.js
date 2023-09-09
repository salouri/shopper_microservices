const express = require("express");
const Registry = require("../lib/Registry");

const router = express.Router();
const registry = new Registry();

// Define your RESTful routes here
router.put(
  "/registery/:servicename/:serviceversion/:serviceport",
  (req, res, next) => {
    const { servicename, serviceversion, serviceport } = req.params;
    let serviceIP = req.socket.remoteAddress;
    if (serviceIP.includes("::1") || serviceIP.includes("::ffff:127.0.0.1"))
      serviceIP = "127.0.0.1";

    const key = registry.register(
      servicename,
      serviceversion,
      serviceIP,
      serviceport
    );
    res.send(key);
    return next();
  }
);

router.delete(
  "/registery/:servicename/:serviceversion/:serviceport",
  (req, res, next) => {
    const { servicename, serviceversion, serviceport } = req.params;
    let serviceIP = req.socket.remoteAddress;
    if (serviceIP.includes("::1") || serviceIP.includes("::ffff:127.0.0.1"))
      serviceIP = "127.0.0.1";
    const deletedKey = registry.unregister(
      servicename,
      serviceversion,
      serviceIP,
      serviceport
    );
    res.json({ result: deletedKey });
    return next();
  }
);

router.get("/registery/:servicename/:serviceversion", (req, res, next) => {
  const { servicename, serviceversion } = req.params;

  const result = registry.find(servicename, serviceversion);

  res.status(result.length ? 200 : 404).json(result);
  return next();
});
module.exports = router;
