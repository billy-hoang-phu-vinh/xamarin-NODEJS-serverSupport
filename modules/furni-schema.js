const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let furni = new Schema({
    title: String,
    image: String,
    price: Number,
    category: String,
    tags: [String],
    bought: Number,
    rating: Number,
    reviews: Number
});

module.exports = furni;