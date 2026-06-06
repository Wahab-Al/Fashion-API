export interface IOrder{
  id: number, 
  uuid: string, // UUID
  total_price: number, 
  user_id: number, 
  status: 'pending' | 'processing' | 'delivered' | 'cancelled', 
  created_at: Date,
  updated_at: Date
}