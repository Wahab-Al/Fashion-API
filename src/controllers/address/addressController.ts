import { Request, Response } from "express";
import { getUserAddressesService, createAddressService, updateAddressService, deleteAddressService } from "../../services/address/addressService";


interface AuthenticatedRequest extends Request {
  user?: { uuid: string }
}


// GET /api/addresses
export const getUserAddresses = async (request: AuthenticatedRequest, response: Response) 
: Promise<void> => {
  try {
    const addresses = await getUserAddressesService(request.user!.uuid)
    response.status(200).json({ data: addresses })
  } catch (error: any) {
    response.status(500).json({ error: "Internal server error while fetching addresses" })
  }
}




// POST /api/addresses
export const createAddress = async (request: AuthenticatedRequest, response: Response) 
: Promise<void> => {
  try {
    const address = await createAddressService(request.user!.uuid, request.body)
    response.status(201).json({ message: 'Address created successfully', data: address })
  } catch (error: any) {
    response.status(500).json({ error: error.message })
  }
} 




// PATCH /api/addresses/:uuid
export const updateAddress = async (request: AuthenticatedRequest, response: Response) 
: Promise<void> => {
  try {
    const addressUuid = String(request.params.uuid)
    const userUuid = request.user!.uuid

    const user = await getUserAddressesService(userUuid)
    const isCorrectAddress = user.some(address => address.uuid === addressUuid)
    if(!isCorrectAddress) {
      response.status(403).json({ error: 'Unauthorized: You do not own this address'})
      return
    }
    await updateAddressService(addressUuid, request.body)
    response.status(200).json({ message: 'Address updated successfully' })
  } catch (error: any) {
    response.status(500).json({ error: error.message })
  }
} 




// DELETE /api/addresses/:uuid
export const deleteAddress = async (request: AuthenticatedRequest, response: Response)
: Promise<void> => {
  try {
    const addressUuid = String(request.params.uuid)
    const userUuid = request.user!.uuid

    const user = await getUserAddressesService(userUuid)
    const isCorrectAddress = user.some(address => address.uuid === addressUuid)
    if(!isCorrectAddress) {
      response.status(403).json({ error: 'Unauthorized: You do not own this address'})
      return
    }
    await deleteAddressService(addressUuid)
    response.status(200).json({ message: 'Address deleted successfully' })
  } catch (error: any) {
    response.status(500).json({ error: error.message })
  }
}