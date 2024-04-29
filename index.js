const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//Middleware
app.use(cors());
app.use(express.json());


// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASS)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@atlascluster.bbzq5pl.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster`;

console.log(uri)


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const artCollection = client.db('artDB').collection('artCraft')
        const userCollection = client.db('artDB').collection('user')
        const categoryCollection = client.db('artDB').collection('ceramicsAndPottery')

        //Sub-category
        app.get('/ceramicsAndPottery', async (req, res) => {
            const cursor = categoryCollection.find();
            const categoryResult = await cursor.toArray()
            res.send(categoryResult)
        })


        //user-card collection
        app.get('/artCraft', async (req, res) => {
            const cursor = artCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/artCraft/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await artCollection.findOne(query)
            res.json(result)
        })


        app.post('/artCraft', async (req, res) => {
            const newArt = req.body;
            console.log(newArt);
            const result = await artCollection.insertOne(newArt);
            res.send(result)
        })

        app.put('/artCraft:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedArt = req.body;

            const art = {
                $set: {
                    image: updatedArt.image,
                    item: updatedArt.item,
                    category: updatedArt.category,
                    description: updatedArt.description,
                    price: updatedArt.price,
                    customization: updatedArt.customization,
                    stock: updatedArt.stock,
                    time: updatedArt.time,
                    rating: updatedArt.rating
                }
            }

            const result = await artCollection.updateOne(filter, art, options)
            res.send(result)
        })

        app.delete('/artCraft/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await artCollection.deleteOne(query);
            res.send(result)
        })



        //user related api

        app.get('/user', async (req, res) => {
            const cursor = userCollection.find();
            const users = await cursor.toArray();
            res.send(users)
        })

        app.post('/user', async (req, res) => {
            const user = req.body;
            console.log(user)
            const result = await userCollection.insertOne(user)
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Art and Craft Site is Running')
})

app.listen(port, () => {
    console.log(`Art and Craft Site is Running on port ${port}`)
})