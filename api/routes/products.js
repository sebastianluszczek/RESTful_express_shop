const express = require("express");
const router = express.Router();
const multer = require("multer");

const checkAuth = require('../middleware/check-auth');

const ProductsController = require('../controllers/productsControllers');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "iamge/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

const Product = require("../models/Product");

router.get("/", ProductsController.products_get_all);

router.post("/", checkAuth, upload.single("productImage"), ProductsController.products_post);

router.get("/:productId", ProductsController.products_get);

router.patch("/:productId", checkAuth, ProductsController.products_patch);

router.delete("/:productId", checkAuth, ProductsController.products_delete);

module.exports = router;
