const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true}));
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const path = require('path');
const spawn = require('child_process').spawn;

const { Counter } = require('./models/Counter.js')

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/react_project/build')));

mongoose
    .connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> {
        console.log('Successfully connected to mongodb')
        app.listen(process.env.PORT, ()=>{
            console.log(`listening on ${process.env.PORT}`);
        })
    })
    .catch(e => console.error(e));

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '/react_project/build/index.html'));
})

app.use('/api/item', require('./routes/item.js'));

app.get('/api/item_cnt', (req, res)=>{
    // console.log(req);
    Counter.findOne({name : 'item_cnt'}, (err, result)=>{
        res.json(result)
        // console.log(result.item_cnt)
    })
});

app.use('/api/user', require('./routes/user.js'));

app.use('/api/rating', require('./routes/rating.js'));

app.use('/api/recommender', require('./routes/recommender.js'))

app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, '/react_project/build/index.html'));
})

// const fs = require('fs');
// // const jsonFile = fs.readFileSync('./meta_data_end.json', 'utf-8');
// // const jsonData = JSON.parse(jsonFile);
// // const items = jsonData.items;
// const jsonFile = fs.readFileSync('./rating_data_end.json', 'utf-8');
// const jsonData = JSON.parse(jsonFile);
// const ratings = jsonData.ratings;

// let db;
// MongoClient.connect(process.env.DB_URL, (error, client)=>{
//     if(error) return console.log(error);
//     db = client.db('graduate');
//     app.db = db;

//     app.listen(process.env.PORT, ()=>{
//         console.log(`listening on ${process.env.PORT}`);
//     });

//     // items.forEach((item, index)=>{
//     //     item.index = index;
//     // })

//     // db.collection('items').insertMany(items, (err,result)=>{})

//     db.collection('ratings').insertMany(ratings, (err,result)=>{})

// });