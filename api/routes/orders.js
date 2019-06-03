const express = require("express");
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const OrdersController = require('../controllers/ordersControllers');

router.get("/", checkAuth, OrdersController.orders_get_all);

router.post("/", checkAuth, OrdersController.orders_post);

router.get("/:orderId", checkAuth, OrdersController.orders_get);

router.delete("/:orderId", checkAuth, OrdersController.orders_delete);

module.exports = router;
