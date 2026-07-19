import { Request, Response, NextFunction } from 'express'
import { ZodType } from 'zod'

export const validate = (schema: ZodType) => 
  (request: Request, response: Response, next: NextFunction): void => {
    const result = schema.safeParse(request.body)
    if (!result.success) {
      response.status(400).json({
        error: 'Validation failed',
        details: result.error.issues.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      })
      return
    }
    request.body = result.data
    next()
  }