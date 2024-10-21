import Express, { Request, Response } from 'express'

import { CreatedHandler, SuccesHandler } from '../handlers/SuccessHandler'

export const router = Express.Router()

type AccountData = {
  branch: string,
  account: string,
}

type CardData = {
  type: string,
  number: string,
  cvv: string,
}

type TransactionsData = {
  value: number,
  description: string
}

type InternalTransaction = TransactionsData & {
  receiverAccountId: string
}

router.post('/', (req: Request<{}, {}, AccountData>, res: Response) => {
  CreatedHandler({}, res)
})

router.post('/:accountId/cards', (req: Request<{ accountId: string }, {}, CardData>, res: Response) => {
  CreatedHandler({}, res)
})

router.post('/:accountId/transactions', (req: Request<{ accountId: string }, {}, TransactionsData>, res: Response) => {
  CreatedHandler({}, res)
})

router.post('/:accountId/transactions/internal', (req: Request<{ accountId: string }, {}, InternalTransaction>, res: Response) => {
  CreatedHandler({}, res)
})

router.post('/:accountId/transactions/:transactionId/revert', (req: Request<{ accountId: string, transactionId: string }, {}, {}>, res: Response) => {
  CreatedHandler({}, res)
})

router.get('/', (req: Request<{}, {}, {}>, res: Response) => {
  SuccesHandler({}, res)
})

router.get('/:accountId/cards', (req: Request<{}, {}, {}>, res: Response) => {
  SuccesHandler({}, res)
})

router.get('/:accountId/transactions', (req: Request<{ accountId: string }, {}, {}>, res: Response) => {
  CreatedHandler({}, res)
})

router.get('/:accountId/balance', (req: Request<{ accountId: string }, {}, {}>, res: Response) => {
  CreatedHandler({}, res)
})
