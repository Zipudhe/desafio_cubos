import Express from 'express'
import { PeopleController } from '../controllers/index'

export const router = Express.Router()

router.post("/", PeopleController.createPeople)

