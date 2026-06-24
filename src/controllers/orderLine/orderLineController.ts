import { Request, Response } from 'express'
import { getOrderLinesByOrderUuidService } from '../../services/orderLine/orderLineService'




// GET /api/order-ine
export const getOrderLinesByOrder = async (request: Request, response: Response): Promise<void> => {
  try {
    const orderUuid = String(request.params.uuid)
    const userUuid = request.user!.uuid

    const orderLines = await getOrderLinesByOrderUuidService(orderUuid, userUuid)
    
    response.status(200).json({ data: orderLines })
  } catch (error: any) {
    response.status(500).json({ error: error.message })
  }
}