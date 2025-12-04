const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const OrderItem = require('../models/order-item');
const { populate } = require('dotenv');
const orderItem = require('../models/order-item');


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
        .populate({ path: 'orderItems', populate: 'product', populate: 'category' })
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

    const totalPrices = await Promise.all(
        orderItemsIds.map(async (orderItemId) => {
            const orderItem = await OrderItem.findById(orderItemId).populate(
                "product",
                "price"
            );
            const totalPrice = orderItem.product.price * orderItem.quantity;
            return (totalPrice)
        })
    );

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0)

    console.log(totalPrices);


    let order = new Order({
        orderItems: orderItemsIds,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    });
    order = await order.save();

    if (!order)
        return res.status(404).send('The order cannot be created!');
    res.send(order);
});

router.put(`/:id`, async (req, res) => {
    const order = await Order.findByIdAndUpdate(req.params.id, {
        status: req.body.status
    },
        { new: true }
    )

    if (!order)
        return res.status(400).send('the order cannot be created')
    res.send(order)
})

// Delete order
router.delete("/:id", async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id).then(async order => {
            if (order) {
                await order.orderItems.map(async orderItem => {
                    await OrderItem.findByIdAndDelete(orderItem)
                })
                return res.status(404).json({ success: true, message: "Order deleted successfully" });
            } else {
                res.status(200).json({ success: false, message: "order not found" });
            }
        })
    } catch (error) {
        console.log("DELETE ERROR =>", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
});

router.get('/get/totalsales', async (req, res) => {
    const totalSales = await Order.aggregate([
        { $group: { _id: null, totalsales: { $sum: '$totalPrice' } } }
    ])

    if (!totalSales) {
        return res.status(400).send('The order sales cannot be generated')
    }

    res.send({ totalsales: totalSales.pop().totalsales })
})

router.get('/get/count', async (req, res) => {
    try {
        const orderCount = await Order.countDocuments();  // Counts all products

        res.status(200).json({ success: true, orderCount });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/get/userorders/:userid', async (req, res) => {
    try {
        const userId = req.params.userid;  // FIXED


        const userorderList = await Order.find({ user: userId })
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'product',
                    populate: 'category'
                }
            })
            .sort({ dateOrdered: -1 });

        if (!userorderList) {
            return res.status(404).json({
                success: false,
                message: "No orders found for this user"
            });
        }

        res.send(userorderList);
        // console.log(userorderList);
        // const orders = await Order.find();
        // console.log("All orders: ", orders);

        // console.log("UserID param:", req.params.userid);


    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});




module.exports = router;