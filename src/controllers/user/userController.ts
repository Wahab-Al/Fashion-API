import { Request, response, Response } from "express";
import { getAllUsersService, getUserByUuidService, updateUserService, deleteUserService } from "../../services/user/userService";

interface AuthenticatedRequest extends Request {
  user?: { uuid: string }
}


// Get all users
export const getAllUsers = async () : Promise<void> => {
  try {
    const users = await getAllUsersService()
    response.status(200).json({data: users})
  } catch (error: any) {
    response.status(500).json({error: error.message})
  }
}


// Get user by uuid
export const getUserByUuid = async (request: Request, response: Response): Promise<void> => {
  try {
    const uuid  = String(request.params.uuid)
    const user = await getUserByUuidService(uuid)
    response.status(200).json({ data: user })
  } catch (error: any) {
    response.status(404).json({ error: error.message })
  }
}


// Update user
export const updateUser = async (request: AuthenticatedRequest, response: Response): Promise<void> => {
  try {
    const { uuid } = request.params
    if (request.user?.uuid !== uuid) {
      response.status(403).json({ error: 'Unauthorized' })
      return
    }
    await updateUserService(uuid, request.body)
    response.status(200).json({ message: 'User updated successfully' })
  } catch (error: any) {
    response.status(500).json({ error: error.message })
  }
}


// Delete user
export const deleteUser = async (request: AuthenticatedRequest, response: Response): Promise<void> => {
  try {
    const { uuid } = request.params
    if (request.user?.uuid !== uuid) {
      response.status(403).json({ error: 'Unauthorized' })
      return
    }
    await deleteUserService(uuid)
    response.status(200).json({ message: 'User deleted successfully' })
  } catch (error: any) {
    response.status(500).json({ error: error.message })
  }
}