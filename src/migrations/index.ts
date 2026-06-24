import { up as upUsers, down as downUsers } from './user/001_create_users_table'
import { up as upCategories, down as downCategories } from './category/002_create_categories_table'
import { up as upProducts, down as downProducts } from './product/003_create_products_table'
import { up as upOrders, down as downOrders } from './order/004_create_orders_table'
import { up as upOrderLines, down as downOrderLines } from './orderLine/005_create_order_lines_table'
import { up as upAddress, down as downAddress } from './Address/006_create_address_table'
import { up as upToken, down as downToken } from './token/007_create_token_table'


/**
 * Executes all 'UP' migrations to build the database schema
 */
export const runMigrations = async () : Promise<void> => {
  try {
    await upUsers()
    await upCategories()
    await upProducts()
    await upOrders()
    await upOrderLines()
    await upAddress()
    await upToken()
    console.log(`All UP migrations completed successfully.. `)
  } catch (error) {
    console.error(`Migration UP failed ${error}`)
    throw error
  }
}



/**
 * Executes all 'DOWN' migrations to tear down the database schema
 */
export const runDownMigrations = async (): Promise<void> => {
  try {
    await downOrderLines()
    await downOrders()
    await downAddress()
    await downProducts()
    await downCategories()
    await downUsers()
    await downToken()
    console.log('All DOWN migrations completed successfully.')
  } catch (error) {
    console.error(`Migration Down failed ${error}`)
    throw error
  }
}