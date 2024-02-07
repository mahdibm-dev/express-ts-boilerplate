import { Request, Response } from "express"
import { checkoutOptions } from "../types"
import Order from "../models/order.model"
import OrderProduct from "../models/orderProduct.model"
import Product from "../models/product.model"

export const makeOrder = async (req: Request, res: Response) => {
  try {
    console.log(req.body)
    const { cart, checkoutOptions }: { cart: Product[]; checkoutOptions: checkoutOptions } = req.body
    // check products in the cart from the database
    const productIds = cart.map((product) => product.id)
    const checkedProducts = await Product.findAll({
      where: { id: productIds }
    })
    // insert order
    const newOrder = await Order.create({
      payment_method: checkoutOptions.paymentMethod,
      shipping_address_first_name: checkoutOptions.shippingAddress.firstName,
      shipping_address_last_name: checkoutOptions.shippingAddress.lastName,
      shipping_address_address: checkoutOptions.shippingAddress.address,
      shipping_address_zip_code: checkoutOptions.shippingAddress.zipCode,
      shipping_address_province: checkoutOptions.shippingAddress.province,
      shipping_address_country: checkoutOptions.shippingAddress.country,
      billing_address_first_name: checkoutOptions.billingAddress.firstName,
      billing_address_last_name: checkoutOptions.billingAddress.lastName,
      billing_address_address: checkoutOptions.billingAddress.address,
      billing_address_zip_code: checkoutOptions.billingAddress.zipCode,
      billing_address_province: checkoutOptions.billingAddress.province,
      billing_address_country: checkoutOptions.billingAddress.country,
      card_first_name: checkoutOptions.creditCardInformation.firstName,
      card_last_name: checkoutOptions.creditCardInformation.lastName,
      card_number: checkoutOptions.creditCardInformation.cardNumber,
      cvv: +checkoutOptions.creditCardInformation.cvv,
      use_shipping_address: checkoutOptions.useShippingAddress
    })
    // insert orderProducts
    for (const product of checkedProducts) {
      await OrderProduct.create({
        order_id: newOrder.id,
        product_id: product.id
      })
    }

    res.status(200).send({ success: true, message: "Order created successfully" })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: error.message
    })
  }
}
