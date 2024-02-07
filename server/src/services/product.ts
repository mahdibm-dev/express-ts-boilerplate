import Product from "../models/product.model"

export const getPagination = (page: number, perPage: number): { start: number; end: number } => {
  const perPageNumber = perPage ? perPage : 12
  const start = page ? (page - 1) * perPageNumber : 0
  const end = perPageNumber

  return { start, end }
}

export const getPagingData = (
  data: { count: number; rows: Product[] },
  page: number,
  end: number
): { currentPage: number; totalPages: number; totalItems: number; products: Product[] } => {
  const { count: totalItems, rows: products } = data
  const currentPage = page ? page : 0
  const totalPages = end > 0 ? Math.ceil(totalItems / end) : totalItems

  return { currentPage, totalPages, totalItems, products }
}
