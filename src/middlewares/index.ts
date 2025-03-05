import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'

import { UnAuthorized } from '@handlers/ErrorHandler'

dotenv.config()

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { headers } = req

  if (!headers['authorization']) {
    return UnAuthorized('missing token', res)
  }

  const secret = process.env.JWT_SECRET
  const token = headers['authorization'].replace('Bearer ', '')

  try {
    const jwtData = jwt.verify(token, secret) as JwtPayload

    req.body = { ...req.body, personId: jwtData.data.id }

    next()
  } catch (error) {
    return UnAuthorized(error.message, res)
  }
}
