import Express from 'express'
import { router as PeopleRouter } from './people'
import { router as AccountsRouter } from './accounts'
import { router as CardsRouter } from './accounts'
import { AuthController } from '../controllers'
import { authMiddleware } from '../middlewares'

export const router = Express.Router()

router
  .use("/people", PeopleRouter)
  .post('/login', AuthController.login)

router.use(authMiddleware)

router
  .use("/accounts", AccountsRouter)
  .use("/cards", CardsRouter)

