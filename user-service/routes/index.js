// Required modules and services are imported
const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("../config");
const UserService = require("../lib/UserService");

// Express router is instantiated
const router = express.Router();

function filterResponse(user) {
  return { id: user.id, email: user.email, isAdmin: user.isAdmin };
}

router.get("/users", async (req, res) => {
  try {
    const users = await UserService.getAll();
    return res.json(users.map(filterResponse));
  } catch (error) {
    console.error(error);
    throw error;
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const user = await UserService.getOne(req.params.id);
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.json(filterResponse(user));
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("General error");
  }
});

router.post("/users", async (req, res) => {
  try {
    const newUser = await UserService.create(req.body);
    res.json(filterResponse(newUser));
  } catch (error) {
    console.error(error);
    res.status(500).send("General error");
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await UserService.update(req.params.id, req.body);
    if (!updatedUser) return res.status(404).send("User not found");
    return res.json(filterResponse(updatedUser));
  } catch (error) {
    console.error(error);
    return res.status(500).send("General error");
  }
});

// Route to authenticate user
router.post("/users/authenticate", async (req, res) => {
  try {
    let authUser = await UserService.authenticate(
      req.body.email,
      req.body.password
    );
    if (!authUser) return res.status(403).send("User not found");

    authUser = filterResponse(authUser);
    const token = jwt.sign(authUser, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    });
    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).send("General error");
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const deletionResult = await UserService.remove(req.params.id);
    if (deletionResult.deletedCount === 0) {
      res.status(404).send("User not found");
    } else {
      res.status(204).send();
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("General error");
  }
});
// Export the router
module.exports = router;
