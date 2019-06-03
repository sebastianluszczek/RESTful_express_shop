const express = require("express");
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const UserControlers = require('../controllers/userControllers')

router.post("/signup", UserControlers.users_signup);

router.post("/login", UserControlers.user_login);

router.delete("/:userId", checkAuth, UserControlers.user_delete);

module.exports = router;
