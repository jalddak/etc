const { response } = require('express');
const { Item } = require('./../models/Item.js')

let router = require('express').Router();

router.get('/search', (req, res)=>{
    let searchCondition = [
        {
            $match: {
                title: {$regex: req.query.value, '$options':'i'}
            }
        },
        {
            $sort: {index: 1}
        },
    ]
    Item.aggregate(searchCondition, 
    ((error, result)=>{
        // console.log(result);
        res.json(result);
    }))
});

router.get('/:id', (req, res)=>{
    let start = (req.params.id - 1) * 20
    let end = req.params.id * 20
    Item.find({index : {$gte: start, $lt: end}},
    ((err,result)=>{
        res.json(result);
        // console.log(result);
    }));
});

let ObjectId = require('mongodb').ObjectId;

router.get('/detail/:id', (req, res)=>{
    // console.log('아무말디테일')
    Item.findOne({_id : new ObjectId(req.params.id)},
    ((err,result)=>{
        res.json(result);
    }));
});

module.exports = router;