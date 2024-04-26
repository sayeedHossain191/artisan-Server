const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Art and Craft Site is Running')
})

app.listen(port, () => {
    console.log(`Art and Craft Site is Running on port ${port}`)
})