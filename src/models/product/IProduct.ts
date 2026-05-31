export interface IProduct {
  id: number, 
  uuid: string, // UUID
  name: string, 
  price: number, 
  old_price: number,
  rating: number,
  sub_img_url: string,
  slug: string,
  category_id: number, 
  description: string,
  number_in_stock: number, 
  img_url: string, 
  created_at: Date,
  updated_at: Date
}