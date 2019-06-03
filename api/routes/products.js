const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

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

router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id productImage")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            productImage: doc.productImage,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post("/", upload.single("productImage"), (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Product created successfuly",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/:productId", (req, res, next) => {
  Product.findById(req.params.productId)
    .select("name price _id productImage")
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          name: doc.name,
          price: doc.price,
          _id: doc._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/"
          }
        });
      } else {
        res.status(404).json({
          message: "No valid entry for this ID"
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.patch("/:productId", (req, res, next) => {
  Product.update(
    {
      _id: req.params.productId
    },
    req.body
  )
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product Updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + req.params.productId
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:productId", (req, res, next) => {
  Product.remove({
    _id: req.params.productId
  })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product Deleted",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/"
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
