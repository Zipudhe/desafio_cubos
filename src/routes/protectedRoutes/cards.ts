import Express, { Request, Response } from 'express'

import { SuccesHandler } from '../../handlers/SuccessHandler'

export const router = Express.Router()

type PaginationData = {
  itemsPerPage: number,
  currentPage: number
}


type CardData = {
  id: string,
  type: string,
  number: string,
  cvv: string,
  createdAt: Date,
  updatedAt: Date
}

router.get('/', (req: Request<{}, {}, CardData, PaginationData>, res: Response) => {
  SuccesHandler({}, res)
})
