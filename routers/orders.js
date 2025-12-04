const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const OrderItem = require('../models/order-item');
const { populate } = require('dotenv');


// Get Orders
router.get(`/`, async (req, res) => {
    const orderList = await Order.find().populate('user', 'name').sort({ 'dateOrdered': -1 });
    if (!orderList) {
        res.status(500).json({
            success: false
        })
    }
    res.send(orderList)
})

// Get order by id
router.get(`/:id`, async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name')
        .populate({ path: 'orderItems', populate: 'product' })
    if (!order) {
        res.status(500).json({
            success: false
        })
    }
    res.send(order)
})

// Create new order
router.post('/', async (req, res) => {

    const orderItemsIds = await Promise.all(req.body.orderItems.map(async orderItem => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })
        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
    }));

    // 2. (Optional but better) calculate total price from order items
    /*
    const totalPrices = await Promise.all(
        orderItemsIds.map(async (orderItemId) => {
            const orderItem = await OrderItem.findById(orderItemId).populate(
                "product",
                "price"
            );
            return orderItem.product.price * orderItem.quantity;
        })
    );
    const totalPrice = totalPrices.reduce((acc, curr) => acc + curr, 0);
    */

    let order = new Order({
        orderItems: orderItemsIds,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: req.body.totalPrice,
        user: req.body.user,
    });
    order = await order.save();

    if (!order)
        return res.status(404).send('The order cannot be created!');
    res.send(order);
});

module.exports = router;