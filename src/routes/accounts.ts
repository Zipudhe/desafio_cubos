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

router.post('/', (req: Request<{}, {}, AccountData>, res: Response) => {
  CreatedHandler({}, res)
})

router.post('/:accountId/cards', (req: Request<{}, {}, CardData>, res: Response) => {
  CreatedHandler({}, res)
})

router.get('/', (req: Request<{}, {}, AccountData>, res: Response) => {
  SuccesHandler({}, res)
})

router.get('/:accountId/cards', (req: Request<{}, {}, CardData>, res: Response) => {
  CreatedHandler({}, res)
})
