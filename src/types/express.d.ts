import { Express } from "express";

declare global { 
  namespace Express {
    interface Request {
      user?: {
        uuid: string, role?: string
      }
      token?: string
    }
  }
}