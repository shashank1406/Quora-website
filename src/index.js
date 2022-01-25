const express = require('express');
const mongoose = require('mongoose');
const route = require('./routes/route')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))


mongoose.connect("mongodb+srv://users-open-to-all:hiPassword123@cluster0.uh35t.mongodb.net/srj-database-project6?authSource=admin&replicaSet=atlas-wwe75z-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true",
{useNewUrlParser:true}) 
.then(() => console.log('mongodb running on 27017'))
.catch(err => console.log(err))

app.use('/', route);

app.listen(process.env.PORT || 8000, function() {
    console.log('Express app running on port ' + (process.env.PORT || 8000))
});
