export interface IProduct {
  id: number, 
  uuid: string, // UUID
  name: string, 
  price: number, 
  category_id: number, 
  description: string,
  number_in_stock: number, 
  image: string, 
  created_at: Date,
  updated_at: Date
}