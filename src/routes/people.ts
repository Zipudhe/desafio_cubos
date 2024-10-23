import Express, { Request, Response } from 'express'
import { PeopleController } from '../controllers/index'

export const router = Express.Router()


router.post('/', PeopleController.CreatePeople)
