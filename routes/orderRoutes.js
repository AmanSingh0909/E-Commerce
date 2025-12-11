const express = require('express')
const { getordersController, getOrdersbyIdController, createOrderController, updateOrdersByIdController, deleteOrdersByIdController, getOrderTotalSalesController, getOrdesCountsController, getUserOrdersByUserIdController } = require('../controllers/orders')


const router = express.Router()

// get orders 
router.get(`/`, getordersController )

// get orders by id 
router.get(`/:id`, getOrdersbyIdController)

//create orders
router.post('/', createOrderController)

// update orders
router.put(`/:id`, updateOrdersByIdController)

// delete orders by id
router.delete("/:id", deleteOrdersByIdController)

// get totalsales
router.get('/get/totalsales', getOrderTotalSalesController)

// get orders counts
router.get('/get/count', getOrdesCountsController)

// get user orders by user id
router.get('/get/userorders/:userid', getUserOrdersByUserIdController)

module.exports = router