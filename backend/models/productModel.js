const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    dateOfSale: String,
    sold: Boolean,
    category: String
});

module.exports = mongoose.model('Product', productSchema);