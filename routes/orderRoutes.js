const express = require('express')
const { getordersController, getOrdersbyIdController, createOrderController, updateOrdersByIdController, deleteOrdersByIdController, getOrderTotalSalesController, getOrdesCountsController, getUserOrdersByUserIdController } = require('../controllers/orders')


const router = express.Router()


router.get(`/`, getordersController )

router.get(`/:id`, getOrdersbyIdController)

router.post('/', createOrderController)

router.put(`/:id`, updateOrdersByIdController)

router.delete("/:id", deleteOrdersByIdController)

router.get('/get/totalsales', getOrderTotalSalesController)

router.get('/get/count', getOrdesCountsController)

router.get('/get/userorders/:userid', getUserOrdersByUserIdController)

module.exports = router