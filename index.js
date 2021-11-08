const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;


//middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mbzhc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try{
            await client.connect();
            const database = client.db('travelling');
            const servicesCollection = database.collection('customer')
            //user collection
            const userCollection = database.collection('user');

            //get api for userCollection
            app.get('/user',async(req,res) =>{
                const cursor = userCollection.find({});
                const user =await cursor.toArray();
                res.json(user);
            })
           //post api For userCollection
            app.post('/user',async(req,res) =>{
                const newUser = req.body;
                const result = await userCollection.insertOne(newUser);
                // console.log('added user', result);
                // console.log('got new user', req.body);
                res.json(result)
            }) 
            
          
            //tour collection
            const tourCollection = database.collection('tour');
            //get api for tourCollection
            app.get('/tour',async(req,res) =>{
               const cursor  = tourCollection.find({});
               const tour = await cursor.toArray();
               res.json(tour); 
            })

            //post api for tourCollection
            app.post('/tour',async(req,res) =>{
                const newTour = req.body;
                const tour = await tourCollection.insertOne(newTour);
                res.send(tour);
            })

            //get single api for tourcollection
            app.get('/tour/:id',async (req,res) =>{
                const id = req.params.id;
                const query = {_id:ObjectId(id)}
                const tour = await tourCollection.findOne(query)
                res.send(tour);
            })


            //get Api for customer
            app.get('/customer',async(req,res)=>{
                const cursor = servicesCollection.find({});
                const customer = await cursor.toArray();
                res.send(customer)
            })
            //Post Api for customer
            app.post('/customer',async(req,res) =>{
                const customer = req.body;
                console.log('hit the post api',customer)
                const result = await servicesCollection.insertOne(customer);
                console.log(result);
                res.send(result)
            })

              //delete api
              app.delete('/user/:id',async(req,res) =>{
                const id = req.params.id;
                const query = {_id: ObjectId(id)};
                const result = await userCollection.deleteOne(query)
                console.log('delete user with id', id);
                res.json(result);
            })
    }
    finally{
        // await client.close();
    }
}



run().catch(console.dir);

app.get ('/', (req,res) =>{
    res.send('Running my CardServer')
})

app.listen(port,() =>{
    console.log('Running server port',port);
});