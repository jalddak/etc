const { response } = require('express');
const { Item } = require('../models/Item.js');
const { Rating } = require('./../models/Rating.js')

let router = require('express').Router();

router.get('/', (req, res)=>{
    // console.log('아무말디테일')
    const itemIdList = [];
    const first = [];
    const second = [];
    Rating.find({
        user_id : req.query.user_id,
    },
    ((err,firstResult)=>{
        // console.log(req.query)
        // console.log(result)
        firstResult.forEach(element => {
            itemIdList.push(element.item_id);
        });
        // console.log(itemIdList);
        Item.find().where('item_id').in(itemIdList)
        .exec((err, secondResult)=>{
            firstResult.forEach(item => {
                first.push({item_id: item.item_id, rating: item.rating})
            })
            first.reverse();
            // console.log(first);
            secondResult.forEach(item => {
                second.push({item_id: item.item_id, title: item.title, _id: item._id})
            })
            // console.log(second);
            const map = new Map();
            first.forEach(item => map.set(item.item_id, item));
            second.forEach(item => map.set(item.item_id, {...map.get(item.item_id), ...item}));
            const mergeResult = Array.from(map.values());
            // console.log(mergeResult);
            res.json(mergeResult);
        })
    }));
});

router.get('/detail', (req, res)=>{
    // console.log('아무말디테일')
    Rating.findOne({
        user_id : req.query.user_id,
        item_id : req.query.item_id,
    },
    ((err,result)=>{
        // console.log(req.query)
        res.json(result);
        // console.log(result)
    }));
});

router.post('/add', (req, res)=>{
    // console.log(req.body)
    const rating = new Rating(req.body);
    // console.log(rating)

    rating.save((err, ratingInfo) => {
        if(err) {
            // console.log(err);
            return res.json({ success: false, err})
        };
        return res.status(200).json({ success : true, })
    })
})

router.delete('/delete', (req, res)=>{
    // console.log(req.body)

    Rating.deleteOne({
        user_id: req.body.user_id,
        item_id: req.body.item_id,
    }, (err, ratingInfo) => {
        if(err) {
            // console.log(err);
            return res.json({ success: false, err})
        };
        return res.status(200).json({ success : true, })
    })
})

router.put('/put', (req, res)=>{
    // console.log(req.body)

    Rating.findOneAndUpdate({
        user_id: req.body.user_id,
        item_id: req.body.item_id,
    }, {
        $set: {
            rating: req.body.rating
        }
    }, (err, ratingInfo) => {
        if(err) {
            // console.log(err);
            return res.json({ success: false, err})
        };
        return res.status(200).json({ success : true, })
    })
})



module.exports = router;