export interface IOrderLine {
  id: number,
  uuid: string, //UUID
  order_id: number,
  product_id: number,
  quantity: number,
  price: number
}