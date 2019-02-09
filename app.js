const isTestEnvironment = process.env.NODE_ENV === "test";
const envFilePath = isTestEnvironment ? "./.test-env" : "./.env";

require("dotenv").config({ path: envFilePath });
const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");

const { hasValidToken, hasRoles, ownUserId } = require("./middleware/verifyToken");
const { admin, login, users } = require("./handlers");
const dataAccessObject = require("./dataAccessObject");

app.use(bodyParser.json());

router.post("/login", login.post);
router.get("/admin", hasValidToken, hasRoles(["admin"]), admin.get);
router.get("/users", users.getAll);
router.post("/users", users.post);
router.get("/users/:userId", users.get);
router.put("/users/:userId/username", hasValidToken, ownUserId, users.putUsername);
router.put("/users/:userId/password", hasValidToken, ownUserId, users.putPassword);

app.use("/", express.static(__dirname + "/client/dist"));
app.use("/", router);

async function init() {
  return await dataAccessObject.init();
}

module.exports = { app, init };
