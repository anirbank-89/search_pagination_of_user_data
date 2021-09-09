const e = require('express')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Users = require('./users')

// const users = [
//     {id: 1, name: 'User 1'},
//     {id: 2, name: 'User 2'},
//     {id: 3, name: 'User 3'},
//     {id: 4, name: 'User 4'},
//     {id: 5, name: 'User 5'},
//     {id: 6, name: 'User 6'},
//     {id: 7, name: 'User 7'},
//     {id: 8, name: 'User 8'},
//     {id: 9, name: 'User 9'},
//     {id: 10, name: 'User 10'},
//     {id: 11, name: 'User 11'},
//     {id: 12, name: 'User 12'},
//     {id: 13, name: 'User 13'},
//     {id: 14, name: 'User 14'},
//     {id: 15, name: 'User 15'},
// ]

// const posts = [
//     {id: 1, name: 'Post 1'},
//     {id: 2, name: 'Post 2'},
//     {id: 3, name: 'Post 3'},
//     {id: 4, name: 'Post 4'},
//     {id: 5, name: 'Post 5'},
//     {id: 6, name: 'Post 6'},
//     {id: 7, name: 'Post 7'},
//     {id: 8, name: 'Post 8'},
//     {id: 9, name: 'Post 9'},
//     {id: 10, name: 'Post 10'},
//     {id: 11, name: 'Post 11'},
//     {id: 12, name: 'Post 12'},
//     {id: 13, name: 'Post 13'},
//     {id: 14, name: 'Post 14'},
//     {id: 15, name: 'Post 15'},
// ]

app.get('/users', paginatedResults(Users), (req,res)=>{
    res.json(res.paginated_results)
})

// app.get('/posts', paginatedResults(posts), (req,res)=>{
//     res.json(res.paginated_results)
// })

mongoose.connect('mongodb://127.0.0.1:27017/mydatabase', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
const db = mongoose.connection
db.once('open', async ()=>{
    if (await Users.countDocuments().exec() > 0) return

    Promise.all([
        Users.create({ name: 'User 1'}),
        Users.create({ name: 'User 2'}),
        Users.create({ name: 'User 3'}),
        Users.create({ name: 'User 4'}),
        Users.create({ name: 'User 5'}),
        Users.create({ name: 'User 6'}),
        Users.create({ name: 'User 7'}),
        Users.create({ name: 'User 8'}),
        Users.create({ name: 'User 9'}),
        Users.create({ name: 'User 10'}),
        Users.create({ name: 'User 11'}),
        Users.create({ name: 'User 12'}),
        Users.create({ name: 'User 13'}),
        Users.create({ name: 'User 14'}),
        Users.create({ name: 'User 15'})
    ]).then(()=> console.log('Added users'))
})

function paginatedResults(model) {
    return async (req,res,next)=>{
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const startIndex = (page-1)*limit
        const endIndex = page*limit

        var results = {}
        if (endIndex < await model.countDocuments().exec()) {
            results.next = {
                page: page+1,
                limit: limit
            }
        }
    
        if (startIndex>0) {
            results.previous = {
                page: page-1,
                limit: limit
            }
        }

        // results.results = model.slice(startIndex, endIndex)
        try {
            results.results = await model.find().limit(limit).skip(startIndex).exec()
            res.paginated_results = results
            next()
        }
        catch(e) {
            res.status(500).json({message: e.message})
        }
        
    }
}

app.listen(3000)