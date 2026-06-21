import pool from "../../config/database/db";
import { ICategory } from "../../interfaces/ICategory";
import { v7 as uuid7 } from "uuid";



//#region Category Service

// Get all categories
export const getAllCategoriesService = async () : Promise<ICategory[]> => {
  const [rows] = await pool.execute('SELECT * FROM categories')
  return rows as ICategory[]
}



// Get category by uuid
export const getCategoryByUuidService = async (uuid: string) : Promise<ICategory> =>{
  const [rows] = await pool.execute(
    'SELECT * FROM categories WHERE uuid = ?', [uuid]
  )

  const categories = rows as ICategory[]
  if(categories.length === 0){
    throw new Error('Category that you search not found')
  }
  return categories[0]
}



// Create category infos
export const createCategoryService = async (name: string, img_url?: string) : Promise<ICategory> => {
  const uuid = uuid7()
  await pool.execute(
    'INSERT INTO categories (uuid, name, img_url) VALUES (?, ?, ?)',
    [uuid, name, img_url || null]
  )

  return { uuid, name, img_url } as ICategory
}



// Update category infos
export const updateCategoryService = async (uuid: string, data: Partial<ICategory>) : Promise<void> => {
  const { name, img_url } = data
  const [rows] = await pool.execute('SELECT uuid FROM categories WHERE uuid = ?', [uuid]);
  if ((rows as ICategory[]).length === 0) {
    throw new Error('Category that you want to update not found');
  }
  await pool.execute(
    'UPDATE categories SET name = COALESCE(?, name), img_url = COALESCE(?, img_url) WHERE uuid = ?',
    [name ?? null, img_url ?? null, uuid]
  );
}




// Delete category 
export const deleteCategoryService = async (uuid: string): Promise<void> => {
  const [rows] = await pool.execute(
    'SELECT id FROM categories WHERE uuid = ?', [uuid]
  )
  if ((rows as ICategory[]).length === 0){
    throw new Error('Category that you search not found')
  }
  
  await pool.execute('DELETE FROM categories WHERE uuid = ?', [uuid])
}

//#endregion