export interface IAddress  {
  id: number,
  uuid: string, //UUID
  zip_code: string,
  city: string,
  street: string,
  state: string,
  created_at: Date,
  updated_at: Date
}