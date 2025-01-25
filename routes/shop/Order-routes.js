import express from 'express'

import orderController, { fetchOrderDetails, getRecentOrders, verifyPaymentandSaveOrder } from '../../controllers/shop/order-controller.js'

const router = express.Router()

router.post('/create', orderController.createOrder)
router.post('/verify', verifyPaymentandSaveOrder)
router.get('/fetch', fetchOrderDetails)
router.get('/recent-orders', getRecentOrders)
export default router;