const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//Midleware

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eprwq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();

        const database = client.db("tourism_db");
        const servicestourism = database.collection("service");
        const ordertourism = database.collection("orders");

        //Get Api
        app.get('/service', async (req, res) => {
            const cursor = servicestourism.find({});
            const service = await cursor.toArray();
            res.send(service);
        })
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { email: id };
            const cursor = ordertourism.find(filter);
            const oreder = await cursor.toArray();
            res.send(oreder);
            console.log(id);
        });


        app.get('/orders', async (req, res) => {


            const cursor = ordertourism.find({});
            const oreder = await cursor.toArray();
            res.send(oreder);
            console.log(id);
        })

        //get single service

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting sercice', id)
            const quary = { _id: ObjectId(id) };
            const sercice = await servicestourism.findOne(quary);
            res.json(sercice)
        })

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting sercice', id)
            const quary = { _id: ObjectId(id) };
            const sercice = await ordertourism.deleteOne(quary);
            res.json(sercice)
        })

        //Post Api

        app.post('/service', async (req, res) => {
            const servic = req.body;


            console.log('hitting the post api', servic)

            const result = await servicestourism.insertOne(servic);
            console.log(result)
            res.json(result)
        });

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const orderresult = await ordertourism.insertOne(order);
            res.json(orderresult);
        })

        //Delete Api
        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: ObjectId(id) };
            const result = await servicestourism.deleteOne(quary);
            res.json(result);
        });

        //updated data
        app.put('/service/:id', async (req, res) => {
            const id = req.params.id;
            const updatedservice = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    img: updatedservice.img,
                    name: updatedservice.name,
                    price: updatedservice.price,
                    packege: updatedservice.packege,
                    description: updatedservice.description
                },
            };
            const result = await servicestourism.updateOne(filter, updateDoc, options)
            console.log('updating user', req);
            res.json(result)
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('running tourism server');
});

app.listen(port, () => {
    console.log('running tourism server', port)
})

