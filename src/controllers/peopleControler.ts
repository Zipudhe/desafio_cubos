import { Request, Response } from 'express'
import bcrypt from 'bcrypt'

import { AppDataSource } from '@db/index'
import { People } from '@entities/People'
import { BadRequest, UnprocessableContent, ServerError } from '@handlers/ErrorHandler'
import { CreatedHandler } from '@handlers/SuccessHandler'
import { hasRequiredFields } from '@utils/validators'

import { Person } from './index'

const PeopleRepository = AppDataSource.getRepository(People)

export const createPeople = async (req: Request<{}, {}, Person>, res: Response) => {

  if (!hasRequiredFields(['name', 'document', 'password'], req.body)) {
    return BadRequest('missing required fields', res)
  }

  const data = req.body

  const person = await PeopleRepository.findOne({ where: { document: data.document } })

  if (person) {
    return UnprocessableContent("document already registered", res)
  }

  // WARN: Not fully implemented
  // const isValidated = await validateDocument(data.document)
  //
  // if (!isValidated) {
  //   return UnprocessableContent("the document is invalid", res)
  // }

  bcrypt.hash(data.password, 10, (error, hash) => {
    if (error) {
      return UnprocessableContent('something went wrong', res)
    }

    data['password'] = hash
    data['document'] = data.document.replace(/[\.\-\/]/g, '')
    const newPerson = PeopleRepository.create(data)

    PeopleRepository.save(newPerson)
      .then((person) => {
        delete person['password']
        CreatedHandler<People>(person, res)
      })
      .catch(error => {
        ServerError(error.message, res)
      })
  })
}
