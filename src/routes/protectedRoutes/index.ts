import { router as AccountsRouter } from './accounts'
import { router as CardsRouter } from './accounts'
import { authMiddleware } from '../../middlewares/index'

import { Router } from 'express'

export const protectedRouter = Router()

protectedRouter.use(authMiddleware)
protectedRouter
  .use("/accounts", AccountsRouter)
  .use("/cards", CardsRouter)
