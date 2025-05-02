const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = "mongodb+srv://monjurul190629:asdflkjhg@pro-coder.o7jaztj.mongodb.net/?retryWrites=true&w=majority&appName=pro-coder";

// Initialize
const app = express();
const port = process.env.PORT || 5000;






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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

const myDB = client.db("Orders");
const Ordercollection = myDB.collection("orderCollection");




// For ssl commerce

const SSLCommerzPayment = require('sslcommerz-lts');
const { ObjectId } = require('mongodb');
const store_id = process.env.Store_Id;
const store_passwd = process.env.Store_pass;
const is_live = false //true for live, false for sandbox


// main middleware

app.use(express.json());

app.use(cors());


// for order ssl commerce

app.post('/order', (req, res) => {
    console.log(req.body)

    
    /*
    
    const product = await productCollection.findOne({
        _id : new ObjectId(req.body.productId)
    })
    
    */

    const tran_id = new ObjectId().toString();


    const order = req.body;




    const data = {
        total_amount: 100,
        currency: order.currency,
        tran_id: tran_id, // use unique tran_id for each api call
        success_url: `http://localhost:5000/payment/success/${tran_id}`,
        fail_url: 'http://localhost:3030/fail',
        cancel_url: 'http://localhost:3030/cancel',
        ipn_url: 'http://localhost:3030/ipn',
        shipping_method: 'Courier',
        product_name: 'Computer.',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: order.name,
        cus_email: 'customer@example.com',
        cus_add1: order.address,
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: order.postCode,
        cus_country: 'Bangladesh',
        cus_phone: order.phone,
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };

    
    console.log(data)

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
    sslcz.init(data).then(apiResponse => {
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL
        res.send({url : GatewayPageURL})
        console.log('Redirecting to: ', GatewayPageURL)


        const finalOrder = {
            order, paidStatus : false, tranjectionId : tran_id
        }

        const result = Ordercollection.insertOne(finalOrder);
    });

    
})


app.post("/payment/success/:tranId", async(req, res) => {
    console.log(req.params.tranId);

    const result = await Ordercollection.updateOne(
        {
            tranjectionId : req.params.tranId
        },
        {
            $set:{
                paidStatus : true
            }
        }
    )

    if(result.modifiedCount > 0){
        res.redirect('http://localhost:3000/payMentSuccess')
    }

})



app.get('/', (req, res) => {
    res.send('everything is ok');
})

app.listen(port, () => {
    console.log('Server is running')
})
