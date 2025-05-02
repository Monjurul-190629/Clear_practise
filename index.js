const express = require('express');
const cors = require('cors');
require('dotenv').config();



// Initialize
const app = express();
const port = process.env.PORT || 5000;

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
        success_url: 'http://localhost:3030/success',
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
    });
})






app.get('/', (req, res) => {
    res.send('everything is ok');
})

app.listen(port, () => {
    console.log('Server is running')
})
