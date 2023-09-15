// Required modules and services are imported
const express = require("express");
const UserServiceClient = require("../../services/UserServiceClient");

// Express router is instantiated
const router = express.Router();

// Route to render all items in the catalog
router.post("/login", async (req, res) => {
  try {
    const result = await UserServiceClient.authenticate(
      req.body.email,
      req.body.password
    );

    if (result && result.token) {
      req.session.token = result.token;
      req.session.messages.push({
        type: "success",
        text: "You have been logged in!"
      });
      return res.redirect("/");
    }
    // if (!authUser)
    req.session.messages.push({
      type: "danger",
      text: "Invalid email address or password!"
    });
    return res.redirect("/");
  } catch (err) {
    console.error(err);
    req.session.messages.push({
      type: "danger",
      text: "error!"
    });
    return res.redirect("/");
  }
});

router.get("/logout", (req, res) => {
  req.session.userId = null;
  req.session.token = null;
  req.session.messages.push({
    type: "success",
    text: "You have been logged out!"
  });
  return res.redirect("/");
});

// Export the router
module.exports = router;
