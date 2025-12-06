const express  = require('express')
const { createProductController, countProductController, getProductController, getProductByidController } = require('../controllers/products')

const router = express.Router()

// Create Product
router.post('/', createProductController)

// Count Product
router.post(`/count`, countProductController)

// Get Product
router.get(`/`, getProductController)

// Get Product by id
router.get('/:id', getProductByidController)


module.exports = router