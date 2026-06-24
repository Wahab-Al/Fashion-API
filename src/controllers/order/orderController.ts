import { Request, Response } from 'express'
import type { RowDataPacket } from 'mysql2'
import { 
  getUserOrdersService, 
  getOrderByUuidService, 
  createOrderService, 
  updateOrderStatusService,
  deleteOrderService
} from '../../services/order/orderService'





// GET /api/orders
export const getUserOrders = async (request: Request, response: Response): Promise<void> => {
  try {
    const orders = await getUserOrdersService(request.user!.uuid)
    response.status(200).json({ data: orders })
  } catch (error: any) {
    response.status(500).json({ error: error.message })
  }
}




// GET /api/orders/:uuid
export const getOrderByUuid = async (request: Request, response: Response): Promise<void> => {
  try {
    const order = await getOrderByUuidService(String(request.params.uuid))
    response.status(200).json({ data: order })
  } catch (error: any) {
    response.status(404).json({ error: error.message })
  }
}




// POST /api/orders
export const createOrder = async (request: Request, response: Response): Promise<void> => {
  try {
    const { items } = request.body
    if (!items || items.length === 0) {
      response.status(400).json({ error: 'Order items are required' })
      return
    }
    const order = await createOrderService(request.user!.uuid, items)
    response.status(201).json({ message: 'Order created successfully', data: order })
  } catch (error: any) {
    response.status(500).json({ error: error.message })
  }
}




// PATCH /api/orders/:uuid/status
export const updateOrderStatus = async (request: Request, response: Response): Promise<void> => {
  try {
    const { status } = request.body
    if (!status) {
      response.status(400).json({ error: 'Status is required' })
      return
    }

    await updateOrderStatusService(String(request.params.uuid), status, request.user!.uuid)
    response.status(200).json({ message: 'Order status updated successfully' })
  } catch (error: any) {
    response.status(500).json({ error: error.message })
  }
}




// DELETE /api/orders/:uuid
export const deleteOrder = async (request: Request, response: Response): Promise<void> => {
  try {
    await deleteOrderService(String(request.params.uuid))
    response.status(200).json({ message: 'Order deleted successfully' })
  } catch (error: any) {
    response.status(500).json({ error: error.message })
  }
}