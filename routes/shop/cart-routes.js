import express from 'express'
import { addToCart, DeleteCartItem, FetchCartItems, UpdateCartItemQuantity } from '../../controllers/shop/cart-controller.js'

const router = express.Router()

router.post('/add', addToCart);
router.get('/get/:userId', FetchCartItems)
router.put('/update-cart', UpdateCartItemQuantity)
router.delete('/:userId/:productId', DeleteCartItem)

export default router