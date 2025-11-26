const Category = require('../models/category')
const Product = require('../models/product')
const express = require('express')
const router = express.Router()

router.get(`/`, async (req, res) => {
    const productList = await Product.find()
    res.send(productList)
})

router.post(`/count`, (req, res) => {
    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock
    })

    product.save().then((createdProduct) => {
        res.status(201).send(createdProduct)
    }).catch((err) => {
        res.status(500).json({
            error: err,
            success: false
        })
    })
})

router.post('/', async (req, res) => {
  try {
    //console.log("CATEGORY ID SENT =>", req.body.category);


    // 1. Validate category
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).send('Invalid Category');
    }

    // 2. Create product
    let product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      images: req.body.images,         
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    });

    // 3. Save product
    product = await product.save();
    // console.log('SAVED PRODUCT =>', product);

    if (!product) {
      return res.status(500).send('The product cannot be created!');
    }

    // 4. Return full product
    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });

  } catch (err) {
    console.error('PRODUCT CREATE ERROR =>', err);
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message,
    });
  }
});

module.exports = router