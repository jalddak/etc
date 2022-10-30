const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    name : { type: String },
    cnt : { type: Number }
})

const Counter = mongoose.model("Counter", counterSchema);

module.exports = { Counter };