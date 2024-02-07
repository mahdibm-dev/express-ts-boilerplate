import {
  BeforeCreate,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from "sequelize-typescript"
import Order from "./order.model"
import OrderProduct from "./orderProduct.model"

@Table({
  tableName: "products",
  modelName: "Product",
  timestamps: true
})
class Product extends Model<Product> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  declare id?: string

  @Column({
    type: DataType.STRING
  })
  declare label: string

  @Column({
    type: DataType.STRING
  })
  declare description: string

  @Column({
    type: DataType.FLOAT
  })
  declare price: number

  @Column({
    type: DataType.STRING
  })
  declare image: string

  @Column({
    type: DataType.STRING
  })
  declare slug: string

  @CreatedAt
  declare createdAt?: Date

  @UpdatedAt
  declare updatedAt?: Date

  @BeforeCreate
  static async generateSlug(instance: Product) {
    const count = await Product.count({
      where: {
        label: instance.label
      }
    })
    let suffix = ""
    if (count > 0) {
      suffix = `-${count + 1}`
    }
    instance.slug = `${instance.label.toLowerCase().replace(/\s/g, "-")}${suffix}`
  }

  @BelongsToMany(() => Order, () => OrderProduct)
  orders: Order[]
}
export default Product
