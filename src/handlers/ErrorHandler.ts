import { Response } from 'express'

type ErrorHandler = (message: string, res: Response) => void

export const NotFound: ErrorHandler = (message, res) => {
  const statusMessage = message ?? 'unable to find resource'
  res.status(404).json({ message: statusMessage })
}

export const UnAuthorized: ErrorHandler = (message, res) => {
  const statusMessage = message ?? 'user must be authenticated'
  res.status(401).json({ message: statusMessage })
}

export const UnprocessableContent: ErrorHandler = (message, res) => {
  const statusMessage = message ?? 'Unable to process action'
  res.status(422).json({ message: statusMessage })
}

export const BadRequest: ErrorHandler = (message, res) => {
  const statusMessage = message ?? 'some parameters are missing'
  res.status(400).json({ message: statusMessage })
}

export const ServerError: ErrorHandler = (message, res) => {
  const statusMessage = message ?? 'some parameters are missing'
  res.status(500).json({ message: statusMessage })
}
