import razorpay from "../../helpers/razorpay.js";

export const createOrder = async (req, res) => {
  try {
    const { totalAmount } = req.body;
    console.log(razorpay.key_id)
    const options = {
      amount: totalAmount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
  
    const order = await razorpay.orders.create(options);
    console.log("Razorpay Order Response: ", order);
    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });

  } catch (error) {
    console.error("some error occoured");
    res.status(500).json({ success: false, message: error.message });
  }
};


export default {createOrder}