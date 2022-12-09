const express = require("express");
const cookieParser = require("cookie-parser")
const app = express();
const dotenv = require("dotenv");
const errorMiddleware = require("./middleware/error")
const bodyParser = require("body-parser")
const fileUpload = require("express-fileUpload")
const Razorpay = require("razorpay")
const crypto = require("crypto");
const {payment} = require("../backend/models/paymentModel")

//Config

dotenv.config({path:"backend/config/config.env"})

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload())

//Route imports
const product = require("./routes/productRoutes");
const user = require("./routes/userRoutes")
const order = require("./routes/orderRoutes")

app.use("/api/v1",product);
app.use("/api/v1",user)
app.use("/api/v1",order)

//razor pay 
const razorpay = new Razorpay({
    key_id : process.env.RAZOR_API_KEY,
    key_secret : process.env.RAZOR_SECRET_KEY
})
//orders
app.post('/api/v1/razorpay/order',async(req,res)=>{

    const options ={
    amount : Number(req.body.amount * 100),
    currency: "INR",
    receipt: "success"
}
    const response = await razorpay.orders.create(options)

      res.status(200).json({
        success:true,
        response
      })
})
//verification
app.post('/api/v1/razorpay/verification',async(req,res)=>{

    const {razorpay_order_id,razorpay_payment_id} = req.body

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    var expectedSignature = crypto.createHmac('sha256', process.env.RAZOR_SECRET_KEY)
                                  .update(body.toString())
                                  .digest('hex');
                                  console.log("sig received " , razorpay_signature);
                                  console.log("sig generated " ,expectedSignature);
    
    const isAuthentic = expectedSignature === razorpay_signature
    
    if(isAuthentic){
        
        //Database
        await payment.create({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        })

        res.redirect(`http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`)

    }else{
        res.status(400).json({
            success:false,
          })
    }
})

app.get('/api/v1/razorpay/getkey',(req,res)=>{

    res.status(200).json({
      key : process.env.RAZOR_API_KEY
    })
})

//Middleware for Errors 
app.use(errorMiddleware)

module.exports = app