export interface IUser {
  id: number, 
  uuid: string, //UUID
  name: string,
  surname: string,
  email: string, 
  password: string,
  role: 'customer' | 'admin', 
  tokens: string[],
  created_at: Date,
  updated_at: Date
}