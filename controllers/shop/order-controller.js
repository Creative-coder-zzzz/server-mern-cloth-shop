import razorpay from "../../helpers/razorpay.js";
import crypto from 'crypto'
import { Order } from "../../models/order.js";
import { configDotenv } from "dotenv";
export const createOrder = async (req, res) => {
  try {
    const { totalAmount } = req.body;
 
    const options = {
      amount: totalAmount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
  
    const order = await razorpay.orders.create(options);
    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount*100,
      currency: order.currency,
    
      status: order.status
    });
  
  } catch (error) {
    console.error("some error occoured");
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPaymentandSaveOrder = async(req,res) => {

  const {razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData} = req.body


  try{
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;


    // Generate the HMAC
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_CLIENT_SECRET)
      .update(body)
      .digest("hex");

    
    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const existingOrder = await Order.findOne({orderId : razorpay_order_id});

    if(existingOrder) {
      return res.status(400).json({
        success: false,
        message: "Order already exists"
      })
    }


    //payment verified now save to database

    const newOrder = new Order({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      orderStatus: 'pending',
      amount: req.body.amount,
      userId: orderData.userId,
      cartItems: orderData.cartItems,
      addressInfo: orderData.addressInfo,
      paymentMethod: "Razorpay",
      paymentStatus: "Paid",
      totalAmount: orderData.totalAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: razorpay_payment_id,
      status: "success"
    })
 
    await newOrder.save();

    console.log(newOrder, "new order")

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully and order saved ',
      orderId: newOrder._id,
    })
  }
  catch(e){
    console.log(e, " error verifying payment catch error")
    res.status(500).json({
      success: false,
      message: "Payment verification failed"
    })
  }
}


export const fetchOrderDetails = async (req, res) => {
  try {
    const {userId, paymentId} = req.query;
    
    const query = {} ;
    if(userId) query.userId = userId;
    if(paymentId) query.paymentId = paymentId;
    const orders = await Order.find(query);

    if(!orders.length) {
      return res.status(404).json({
        success : false,
        message: "No orders found"
      })
    }

    res.status(200).json({
      success: true,
      orders
    })
  }catch (error){
    console.error("Error fetching order details: ", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}


export const getRecentOrders = async(req,res) => {
  try{
    const orders = await Order.find().sort({orderDate: -1}).limit(3)

    res.status(200).json({
      success: true,
      data: orders,
      message: 'fetched recent orders'
    })
  }catch (error) {
    console.error("Error fetching recent orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent orders",
    });
  }
}

export default {createOrder, verifyPaymentandSaveOrder, fetchOrderDetails, getRecentOrders}