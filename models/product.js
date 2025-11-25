const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 1000
    }
})

exports.product = mongoose.model('Product', productSchema)