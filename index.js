const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

// middle wares
app.use(cors());
app.use(express.json());

// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASSWORD);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fsjj2rd.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
    try{
        const servicesCollection= client.db("geniusCar").collection("services");
        const ordersCollection= client.db("geniusCar").collection("orders");


        app.get('/services', async(req, res)=>{
            const query = { };
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        })

        app.get('/services/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.send(service);
        })

        app.get('/orders', async(req, res)=>{
            let query = {};
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const curser =  ordersCollection.find(query);
            const orders = await curser.toArray();
            res.send(orders);
        })
        app.delete('/orders/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await  ordersCollection.deleteOne(query)
            res.send(result); 
        })

        app.post('/orders', async(req, res)=>{
            const order = req.body;
            const result = await ordersCollection.insertOne(order)
            res.send(result)
        })
     
    }
    finally{

    }

}
run().catch(err => console.log(err));


app.get('/', (req, res)=>{
    res.send('genius car server running')
});


app.listen(port, ()=>{
    console.log(`run on ${port}`);
})