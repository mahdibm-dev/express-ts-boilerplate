import { getPagination, getPagingData } from "../services/product"
import { Request, Response } from "express"
import Product from "../models/product.model"

export const fetchAllProducts = async (req: Request, res: Response) => {
  try {
    const { page, perPage } = req.query
    const { start, end } = getPagination(Math.abs(+page), +perPage)
    const data: { count: number; rows: Product[] } = await Product.findAndCountAll({
      offset: start,
      limit: end
    })
    const response = getPagingData(data, +page, end)
    setTimeout(() => {
      res.status(200).send(response)
    }, 200)
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving products."
    })
  }
}
