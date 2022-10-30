const e = require('express');
const { response } = require('express');
const { Rating } = require('../models/Rating.js');
const spawn = require('child_process').spawn;
const { Recommender } = require('./../models/Recommender.js')

let router = require('express').Router();

router.get('/', (req,res)=>{
    Recommender.findOne({'name':'popular'}, (err, recommenderResult)=>{
        console.log('no user main')
        res.json(recommenderResult)
        const pyResult = spawn('python3', 
        ['./python_project/popular_calc.py']);
        pyResult.stdout.on('data', (data)=>{
            console.log(data.toString());
        })
        pyResult.stderr.on('data', (data)=>{
            console.log(data.toString());
        })
    })
})

router.get('/:id', (req,res)=>{
    Recommender.findOne({'name': req.params.id}, (err, recommenderResult)=>{
        if(recommenderResult === null){
            Recommender.findOne({'name':'popular'}, (err, recommenderResult)=>{
                res.json(recommenderResult)
                if (req.query.refresh === 'true'){
                    console.log(`진입`)
                    Rating.findOne({user_id : req.params.id}, (err,result)=>{
                        if (result !== null){
                            const pyResult = spawn('python3', 
                            ['./python_project/recommender.py', req.params.id]);
                            pyResult.stdout.on('data', (data)=>{
                                console.log(data.toString());
                            })
                            pyResult.stderr.on('data', (data)=>{
                                console.log(data.toString());
                            })
                        }
                        else{
                            const pyResult = spawn('python3', 
                            ['./python_project/popular_calc.py']);
                            pyResult.stdout.on('data', (data)=>{
                                console.log(data.toString());
                            })
                            pyResult.stderr.on('data', (data)=>{
                                console.log(data.toString());
                            })
                        }
                    })
                }
            })
        }
        else{
            res.json(recommenderResult)
            if (req.query.refresh === 'true'){
                console.log(`진입`)
                Rating.findOne({user_id : req.params.id}, (err,result)=>{
                    if (result !== null){
                        const pyResult = spawn('python3', 
                        ['./python_project/recommender.py', req.params.id]);
                        pyResult.stdout.on('data', (data)=>{
                            console.log(data.toString());
                        })
                        pyResult.stderr.on('data', (data)=>{
                            console.log(data.toString());
                        })
                    }
                    else{
                        Recommender.deleteOne({name: req.params.id}, (err,result)=>{
                            if (!err){
                                console.log('delete success')
                                const pyResult = spawn('python3', 
                                ['./python_project/popular_calc.py']);
                                pyResult.stdout.on('data', (data)=>{
                                    console.log(data.toString());
                                })
                                pyResult.stderr.on('data', (data)=>{
                                    console.log(data.toString());
                                })

                            }
                            else{
                                console.log('delete fail')
                            }
                        })
                    }
                })
            }
        }
    })
})


module.exports = router;