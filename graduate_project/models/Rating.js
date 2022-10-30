const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    user_id : { type: String },
    item_id : { type: String },
    rating : { type: Number },
})

const Rating = mongoose.model("Rating", ratingSchema);

module.exports = { Rating };