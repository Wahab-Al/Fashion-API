import { createUsersTable } from "./user/001_create_users_table";
import { createCategoriesTable } from "./category/002_create_categories_table";
import { createProductTable } from "./product/003_create_products_table";
import { createOrderTabe } from "./order/004_create_orders_table";
import { createOrderLinesTable } from "./orderLine/005_create_order_lines_table";


export const runMigrations = async () : Promise<void> => {
  await createUsersTable()
  await createCategoriesTable()
  await createProductTable()
  await createOrderTabe()
  await createOrderLinesTable()
  console.log(`All migrations completed successfully.. `)
}