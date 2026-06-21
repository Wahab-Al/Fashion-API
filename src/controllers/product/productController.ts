import { Request, Response } from 'express'
import { 
  getAllProductsService, 
  getProductByUuidService, 
  getProductBySlugService, 
  createProductService, 
  updateProductService, 
  deleteProductService 
} from '../../services/product/productService'




// GET /api/products
export const getAllProducts = async (request: Request, response: Response): Promise<void> => {
  try {
    const products = await getAllProductsService()
    response.status(200).json({ data: products })
  } catch (error: any) {
    response.status(500).json({ error: error.message })
  }
}




// GET /api/products/:uuid
export const getProductByUuid = async (request: Request, response: Response): Promise<void> => {
  try {
    const product = await getProductByUuidService(String(request.params.uuid))
    response.status(200).json({ data: product })
  } catch (error: any) {
    response.status(404).json({ error: error.message })
  }
}




// GET /api/products/slug/:slug
export const getProductBySlug = async (request: Request, response: Response): Promise<void> => {
  try {
    const product = await getProductBySlugService(String(request.params.slug))
    response.status(200).json({ data: product })
  } catch (error: any) {
    response.status(404).json({ error: error.message })
  }
}




// POST /api/products
export const createProduct = async (request: Request, response: Response): Promise<void> => {
  try {
    const { name, price, description, number_in_stock, slug, category_id } = request.body
    if (!name || !price || !description || !number_in_stock || !slug || !category_id) {
      response.status(400).json({ error: 'Required fields missing' })
      return
    }
    const product = await createProductService(request.body)
    response.status(201).json({ message: 'Product created successfully', data: product })
  } catch (error: any) {
    response.status(500).json({ error: error.message })
  }
}




// PATCH /api/products/:uuid
export const updateProduct = async (request: Request, response: Response): Promise<void> => {
  try {
    await updateProductService(String(request.params.uuid), request.body)
    response.status(200).json({ message: 'Product updated successfully' })
  } catch (error: any) {
    response.status(500).json({ error: error.message })
  }
}




// DELETE /api/products/:uuid
export const deleteProduct = async (request: Request, response: Response): Promise<void> => {
  try {
    await deleteProductService(String(request.params.uuid))
    response.status(200).json({ message: 'Product deleted successfully' })
  } catch (error: any) {
    response.status(500).json({ error: error.message })
  }
}