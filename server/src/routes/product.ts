/**
 * @swagger
 * /product:
 *   get:
 *     summary: Retrieve a list of products.
 *     description: Retrieve a list of products.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number.
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *         description: The number of items per page.
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentPage:
 *                   type: integer
 *                   description: The current page number.
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   description: The total number of pages.
 *                   example: 1
 *                 totalItems:
 *                   type: integer
 *                   description: The total number of items.
 *                   example: 1
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The user ID.
 *                         example: 0
 *                       name:
 *                         type: string
 *                         description: The user's name.
 *                         example: Leanne Graham
 */
import express from "express"
import { fetchAllProducts } from "../controllers/product"
const router = express.Router()

router.get("/product", fetchAllProducts)

export default router
