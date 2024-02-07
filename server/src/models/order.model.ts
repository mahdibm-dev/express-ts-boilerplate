import { Column, Model, Table, DataType, BelongsToMany, PrimaryKey } from "sequelize-typescript"
import Product from "./product.model"
import OrderProduct from "./orderProduct.model"

@Table({
  tableName: "orders",
  modelName: "Order"
})
class Order extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  declare id?: string

  @Column({
    type: DataType.STRING
  })
  declare payment_method: string

  @Column({
    type: DataType.STRING
  })
  @Column({
    type: DataType.STRING
  })
  declare shipping_address_first_name: string

  @Column({
    type: DataType.STRING
  })
  declare shipping_address_last_name: string

  @Column({
    type: DataType.STRING
  })
  declare shipping_address_address: string

  @Column({
    type: DataType.STRING
  })
  declare shipping_address_zip_code: string

  @Column({
    type: DataType.STRING
  })
  declare shipping_address_province: string

  @Column({
    type: DataType.STRING
  })
  declare shipping_address_country: string
  @Column({
    type: DataType.STRING
  })
  declare billing_address_first_name: string

  @Column({
    type: DataType.STRING
  })
  declare billing_address_last_name: string

  @Column({
    type: DataType.STRING
  })
  declare billing_address_address: string

  @Column({
    type: DataType.STRING
  })
  declare billing_address_zip_code: string

  @Column({
    type: DataType.STRING
  })
  declare billing_address_province: string

  @Column({
    type: DataType.STRING
  })
  declare billing_address_country: string

  @Column({
    type: DataType.STRING
  })
  declare card_first_name: string

  @Column({
    type: DataType.STRING
  })
  declare card_last_name: string

  @Column({
    type: DataType.STRING
  })
  declare card_number: string

  @Column({
    type: DataType.TINYINT
  })
  declare cvv: number

  @Column({
    type: DataType.TINYINT
  })
  declare use_shipping_address: number

  @BelongsToMany(() => Product, () => OrderProduct)
  products: Product[]
}

export default Order
