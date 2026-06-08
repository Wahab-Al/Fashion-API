import { Request, Response } from "express";
import { registerService, loginService, logoutService, logoutAllService } from "../../services/authentication/authService";



interface AuthenticatedRequest extends Request {
  user?: { uuid: string };
  token?: string;
}

// register controller:
export const register = async (request: Request, response: Response) : Promise<void> =>{
  try {
    const { name, surname, email, password, zipCode, city, street, state } = request.body
    if(!name || !surname || !email || !password){
      response.status(400).json({ error: 'All fields are required'})
      return
    }

    const result = await registerService({ name, surname, email, password, zipCode, city, street, state })
    response.status(201).json({ message: 'User registered successfully', data: result})
  } catch (error: any) {
    response.status(400).json({ error: error.message })
  }
}

// login controller:
export const login = async (request: Request, response: Response) : Promise<void> => {
  try {
    const { email, password } = request.body
    if(!email || !password) {
      response.status(400).json({ error: 'Email and password are required'})
      return
    }
    const result = await loginService(email, password)
    response.status(200).json({ message: 'Login successful', data: result})
  } catch (error: any) {
    response.status(401).json({ error: error.message })
  }
}

// logout controller:
export const logout = async (request: AuthenticatedRequest, response: Response) : Promise<void> => {
  try {
    const uuid = request.user?.uuid
    const currentTokens = request.token

    if(!uuid || !currentTokens) {
      response.status(401).json({ error: 'Unauthorized operational state' })
      return
    }

    await logoutService(uuid, currentTokens)
    response.status(200).json({ message: 'Logged out successfully from this device'})
  } catch (error: any) {
    response.status(500).json({ error: error.message})
  }
}

// logoutAll controller:
export const logoutAll = async (request: AuthenticatedRequest, response: Response) : Promise<void> => {
  try {
    const uuid = request.user?.uuid

    if(!uuid) {
      response.status(401).json({ error: 'Unauthorized operational state' })
      return
    }

    await logoutAllService(uuid)
    response.status(200).json({ message: 'Logged out successfully from all devices'})
  } catch (error: any) {
    response.status(500).json({ error: error.message})
  }
}