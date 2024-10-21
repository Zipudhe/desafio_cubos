import { Response } from 'express'

interface SuccesFunction {
  <T>(data: T, res: Response): void
}

export const CreatedHandler: SuccesFunction = (data, res) => {
  res.status(201).json({ data })
  return
}

export const SuccesHandler: SuccesFunction = (data, res) => {
  res.status(200).json({ data })
  return
}
