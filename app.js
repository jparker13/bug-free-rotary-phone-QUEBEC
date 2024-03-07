require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 5500;
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser')
const { ObjectId } = require('mongodb')


// set the view engine to ejs
let path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'));

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectBatonData() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    const result = await client.db("quebec-database").collection("quebec-collection").find().toArray();
    console.log("mongo call await in f/n: ", result);
    return result; 
  } 
  catch(err) {
    console.log("getbatonData() error: ", err);
  }
  finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}

//reading from mongo
app.get('/', async (req, res) => {
    
let result = await connectBatonData();

console.log("myResults: ", result);

  res.render('index', {
   
    pageTitle: "Janna's Baton Databse",
    batonData: result

  });
  
});


//create to mongo 
app.post('/addBaton', async (req, res) => {

  try {
    // console.log("req.body: ", req.body) 
    client.connect; 
    const collection = client.db("quebec-database").collection("quebec-collection");
    
    //draws from body parser 
    console.log(req.body);
    
    await collection.insertOne(req.body);
      
    res.redirect('/');
  }
  catch(err){
    console.log(err)
  }
  finally{
   // client.close()
  }

}) 

app.post('/updateBaton', async (req, res) => {
    try {
        console.log("body: ", req.body);
    
        client.connect;
        const collection = client.db("quebec-database").collection("quebec-collection");
        let result = await collection.findOneAndUpdate(
          {_id: new ObjectId(req.body.id)},
          {$set: {name: req.body.name, bookTitle: req.body.bookTitle}}
        )
    
        .then(result => {
          console.log(result);
          res.redirect('/');
        })
        .catch(error => console.error(error))
      }
      finally {
    
      } 
});

 app.post('/deleteBaton', async (req, res) => {

  try {
    console.log("body: ", req.body); 
    
    client.connect; 
    const collection = client.db("quebec-database").collection("quebec-collection");
    let result = await collection.findOneAndDelete( 
      {
        "_id": ObjectId(req.body.id)
      }
    )
    .then(result => {
      console.log(result); 
      res.redirect('/');
    })
    .catch(error => console.error(error))
  }
  finally{
    //client.close()
  }

}) 

app.listen(port, () => {
console.log(`quebec app listening on port ${port}`)
})