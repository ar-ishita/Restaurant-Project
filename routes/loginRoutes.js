/******************************************************************************
 *   ITE5315 – Project
 *   I declare that this assignment is my own work in accordance with Humber Academic Policy.
 *   No part of this assignment has been copied manually or electronically from any other source
 *   (including web sites) or distributed to other students.
 *
 *   Group member Name: Spencer Standish     Student IDs: N01576620      Date: 05/12/2023
 *   Group member Name: Ishita Arora     Student IDs: N01543414      Date: 05/12/2023
 ******************************************************************************/
const express = require("express");
const baseController = require("../controller/UserLoginController");
const router = express.Router();

router.route("/").get((req, res) => {
  res.redirect("/login");
});

router
  .route("/login")
  .get(baseController.getUserLogin)
  .post(baseController.addUserLogin);

router
  .route("/register")
  .get(baseController.getUserRegister)
  .post(baseController.addUserRegister);

module.exports = router;
