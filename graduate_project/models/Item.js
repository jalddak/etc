const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    item_id : { type: String },
    title : { type: String },
    category : { type: Array },
    imageURL : { type: Array },
    imageURLHighRes : { type: Array },
    index : { type: Number },
})

const Item = mongoose.model("Item", itemSchema);

module.exports = { Item };