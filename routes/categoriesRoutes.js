const express = require('express')
const { getAllCategoriesController, getCategoriesByIdController, createNewCategoryController, updateCategoryByIdController, deleteCategoryController } = require('../controllers/categories')

const router = express.Router()



// Get Categories
router.get('/', getAllCategoriesController)

// Get Categories By Id
router.get('/:id', getCategoriesByIdController)

// Create Category
router.post('/', createNewCategoryController)

// Update Category
router.put('/:id', updateCategoryByIdController)

// Delete Category
router.delete("/:id", deleteCategoryController)


module.exports = router