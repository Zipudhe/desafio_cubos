import Express from 'express'
import { router as PeopleRouter } from './people'
import { router as AccountsRouter } from './accounts'
import { router as CardsRouter } from './accounts'

export const router = Express.Router()

router
  .use("/people", PeopleRouter)
  .use("/accounts", AccountsRouter)
  .use("/cards", CardsRouter)

