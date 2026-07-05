import { RowDataPacket } from "mysql2";
import { ICart } from "./ICart";
import { ICartItem } from "./ICartItem";
import { IProduct } from "./IProduct";


// Represents a cart item enriched with its related product data.
export interface ICartItemWithProduct extends ICartItem {
  product: IProduct
}

// Represents a full cart response returned to the API consumer.
export interface ICartWithItems extends ICart {
  items: ICartItemWithProduct[]
}

// Represents the raw row structure returned from the database query.
export interface ICartItemRow extends RowDataPacket {
  item_id: number;
  item_uuid: string;
  cart_id: number;
  product_id: number;
  quantity: number;
  added_at: Date;
  product: IProduct
}