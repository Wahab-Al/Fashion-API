export interface ICart {
  id: number,
  uuid: string,
  user_id: number,
  status: 'active' | 'abandoned' | 'converted',
  created_at: Date,
  updated_at: Date
}