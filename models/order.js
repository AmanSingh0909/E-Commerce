const mongoose = require('mongoose');


const orderSchema = mongoose.Schema({
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
        required: true
    }],
    shippingAddress1: {
        type: String,
        required: true
    },
    shippingAddress2: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Pending'
    },
    totalPrice: {
        type: Number,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    dateOrdered: {
        type: Date,
        default: Date.now,
    },
});

orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virtuals: true,
});


module.exports = mongoose.model('Order', orderSchema);

/*
{
    "orderItems": [
        
        {
            "quantity": 3,
            "product": "6477f3e2f4d3c2b1a5e8c123"
        },
        {
            "quantity": 1,
            "product": "6477f3e2f4d3c2b1a5e8c456"
        }
    ],
    "shippingAddress1": "123 Main St",
    "shippingAddress2": "Apt 4B",
    "city": "New York",
    "zip": "10001",
    "country": "USA",
    "phone": "555-1234",
    "status": "Pending",
    "totalPrice": 150.75,
    "user": "6477f3e2f4d3c2b1a5e8c789"
}
    */