const express  = require('express')
const { createProductController, countProductController, getProductController, getProductByidController, updateProductByIdController, deleteProductController, GetCountProductController, getfeaturedProductController } = require('../controllers/products')

const router = express.Router()

// Create Product
router.post('/', createProductController)

// Count Product
router.post(`/count`, countProductController)

// Get Product
router.get(`/`, getProductController)

// Get Product by id
router.get('/:id', getProductByidController)

// Update Product by id'
router.put('/:id', updateProductByIdController)

// delete Product by id
router.delete("/:id", deleteProductController)

// Get COunt of Products
router.get('/get/count', GetCountProductController)

// Get featured of Products
router.get('/get/featured', getfeaturedProductController)

module.exports = router