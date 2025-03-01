import Express, { NextFunction, Request, Response } from 'express'
import { router as PeopleRouter } from './people'
import { protectedRouter } from './protectedRoutes'
import { AuthController } from '../controllers'

const router = Express.Router()

router
  .use("/people", PeopleRouter)
  .post("/login", AuthController.login)

router.use(protectedRouter)

export default router
