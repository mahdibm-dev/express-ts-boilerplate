import { Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript"
import Product from "./product.model"
import Order from "./order.model"

@Table({
  tableName: "order_products",
  modelName: "orderProduct",
  timestamps: true
})
class OrderProduct extends Model<OrderProduct> {
  @PrimaryKey
  @ForeignKey(() => Product)
  @Column({
    type: DataType.UUID
  })
  declare product_id: string

  @PrimaryKey
  @ForeignKey(() => Order)
  @Column({
    type: DataType.UUID
  })
  declare order_id: string
}

export default OrderProduct
