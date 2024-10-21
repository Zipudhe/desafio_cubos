import Express from 'express'
import { router as PeopleRouter } from './people'

export const router = Express.Router()

router.use("/people", PeopleRouter)
