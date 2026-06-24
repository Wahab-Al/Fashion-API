import { Request, Response, NextFunction } from "express";
import pool from "../../config/database/db";
import { RowDataPacket } from "mysql2";



//#region Admin Authorization Middleware

// Admin Role-Based Access Control (RBAC) Middleware
export const adminMiddleware = async (request: Request, response: Response, next: NextFunction
) : Promise<void> => {
  try {

    // check if user authenticated with valid uuid
    if (!request.user || !request.user.uuid) {
      response.status(401).json({ error: 'Unauthorized: Authentication required' })
      return
    }

    // Fetch user role from the database
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT role FROM users WHERE uuid = ?', 
      [request.user.uuid] 
    )

    if (rows.length === 0) {
      response.status(404).json({ error: 'User no longer exists' })
      return
    }

    // check the Authorization
    const userRole = rows[0].role
    if (userRole !== 'admin') {
      response.status(403).json({ error: 'Forbidden: Access denied, admin role required' })
      return
    }

    next()
  } catch (error: any) {
    response.status(500).json({ error: error.message })
  }
}

//#endregion