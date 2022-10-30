const mongoose = require('mongoose');

const recommenderSchema = new mongoose.Schema({
    name : { type: String },
    datalist : { type: Array },
})

const Recommender = mongoose.model("Recommender", recommenderSchema);

module.exports = { Recommender };