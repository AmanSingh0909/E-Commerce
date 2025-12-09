const Category = require('../models/category')
const Product = require('../models/product')
const mongoose = require('mongoose')

const getProductController = async (req, res) => {
  try {
    const productList = await Product.find().populate('category');

    res.status(200).json({
      success: true,
      count: productList.length,
      products: productList
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: err.message
    });
  }
};


const countProductController = async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      image: req.body.image,
      countInStock: req.body.countInStock
    });

    const createdProduct = await product.save();

    res.status(201).json({
      success: true,
      product: createdProduct
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};


const createProductController = async (req, res) => {
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
};

const getProductByidController = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      product: product
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    });
  }
};

//Update Product by id
const updateProductByIdController = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send('Invalid Product Id');
    }
    // Validate category
    if (req.body.category) {
      const category = await Category.findById(req.body.category);
      if (!category) {
        return res.status(400).send('Invalid Category');
      }
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
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
      },
      { new: true }

    );
    if (!updatedProduct) {
      return res.status(404).send('Product not found!');
    }
    res.status(200).send(updatedProduct);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong while updating the product',
      error: error.message,
    })
  }
}

// Delete category
const deleteProductController = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Product deleted successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    })
  }
}

// Get count of product
const GetCountProductController = async (req, res) => {
  try {
    const productCount = await Product.countDocuments();  // Counts all products

    res.status(200).json({ success: true, productCount });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Get Featured of Product
const getfeaturedProductController = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true });  // Counts all products

    res.status(200).json({ success: true, products });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}


module.exports = { createProductController, countProductController, getProductController, getProductByidController, updateProductByIdController, deleteProductController, GetCountProductController, getfeaturedProductController }