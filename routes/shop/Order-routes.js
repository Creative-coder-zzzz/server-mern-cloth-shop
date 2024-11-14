import express from 'express'

import orderController from '../../controllers/shop/order-controller.js'

const router = express.Router()

router.post('/create', orderController.createOrder)

export default router;