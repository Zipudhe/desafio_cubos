import { Request, Response } from 'express'
import { AppDataSource } from '@db/index'
import { UnprocessableContent } from '@handlers/ErrorHandler'
import { SuccesHandler } from '@handlers/SuccessHandler'

import { CardResponse } from './index'

type RequestQueryParams = {
  itemsPerPage: number,
  currentPage: number
}


export const getCards: (req: Request<RequestQueryParams, {}, { personId: number }>, res: Response) => Promise<void> = async (req, res) => {
  const itemsPerPage = req.params.itemsPerPage ?? 10
  const page = req.params.itemsPerPage ?? 1
  const currentPage = (page - 1) * itemsPerPage
  const { personId } = req.body


  return AppDataSource.query(`
    SELECT 
      right(card."number", 4) AS "number",
      card."id", card."type", 
      card."createdAt", card."cvv", 
      card."updatedAt" 
    FROM account c
    JOIN card "card" on "card"."accountId" = a.id
    WHERE a."personId" = $1
    limit $2
    offset $3;
`, [personId, itemsPerPage, currentPage])
    .then(cards => SuccesHandler<CardResponse[]>(cards, res))
    .catch(error => UnprocessableContent(error.message, res))
}
