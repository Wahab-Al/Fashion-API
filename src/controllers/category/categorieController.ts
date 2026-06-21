import { Request, Response } from 'express'
import { getAllCategoriesService, getCategoryByUuidService, createCategoryService, updateCategoryService, deleteCategoryService } from '../../services/category/categorieService'


//#region Category Controller


// GET /api/categories
export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await getAllCategoriesService()
    res.status(200).json({ data: categories })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}



// GET /api/categories/:uuid
export const getCategoryByUuid = async (req: Request, res: Response): Promise<void> => {
  try {
    const uuid = String(req.params.uuid)
    const category = await getCategoryByUuidService(uuid)
    res.status(200).json({ data: category })
  } catch (error: any) {
    res.status(404).json({ error: error.message })
  }
}



// POST /api/categories/:uuid
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, img_url } = req.body
    if (!name) {
      res.status(400).json({ error: 'Name is required' })
      return
    }
    const category = await createCategoryService(name, img_url)
    res.status(201).json({ message: 'Category created successfully', data: category })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}



// PATCH /api/categories/:uuid
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const uuid = String(req.params.uuid)
    await updateCategoryService(uuid, req.body)
    res.status(200).json({ message: 'Category updated successfully' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}



// DELETE /api/categories/:uuid
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const uuid = String(req.params.uuid)
    await deleteCategoryService(uuid)
    res.status(200).json({ message: 'Category deleted successfully' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

//#endregion