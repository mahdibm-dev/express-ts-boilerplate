import express from 'express'
import { makeOrder } from '../controllers/order'
const router = express.Router()

router.post('/order', makeOrder)

export default router
