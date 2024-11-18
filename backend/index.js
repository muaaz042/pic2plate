const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors())
app.use(express.json());
const gemini = require('./gemini/gemini');

app.use('/',gemini);


app.listen(5000,()=> {
    console.log('App is running on port: 5000');
})
