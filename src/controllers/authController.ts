import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

import { AppDataSource } from '../db/index'
import { People } from '../entity/People'
import { BadRequest, UnAuthorized } from '../handlers/ErrorHandler'
import { SuccesHandler } from '../handlers/SuccessHandler'
import { hasRequiredFields } from '../utils/validators'

dotenv.config()

const PeopleRepository = AppDataSource.getRepository(People)

export const login = async (req: Request<{}, {}, { document: string, password: string }>, res: Response) => {

  if (!hasRequiredFields(['document', 'password'], req.body)) {
    return BadRequest('missing required fields', res)
  }

  const data = req.body

  const person = await PeopleRepository.findOne({
    select: {
      id: true,
      password: true,
      name: true
    },
    where: { document: data.document }
  })

  if (!person) {
    return UnAuthorized("document or password are invalid", res)
  }

  if (!bcrypt.compareSync(req.body.password, person.password)) {
    return UnAuthorized("document or password are invalid", res)
  }

  delete person['password']

  const token = jwt.sign({
    data: person,
  },
    process.env.JWT_SECRET,
    { expiresIn: '1h' })

  SuccesHandler({ token: `Bearer ${token}` }, res)
}
