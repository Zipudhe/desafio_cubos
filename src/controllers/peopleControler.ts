import { Request, Response } from 'express'
import { AppDataSource } from '../db/index'
import { People } from '../entity/People'
import { BadRequest, UnprocessableContent, ServerError } from '../handlers/ErrorHandler'
import { CreatedHandler } from '../handlers/SuccessHandler'
import { hasRequiredFields } from '../utils/validators'
import bcrypt from 'bcrypt'

const PeopleRepository = AppDataSource.getRepository(People)

export const createPeople = async (req: Request<{}, {}, NewPerson>, res: Response) => {

  if (!hasRequiredFields(['name', 'document', 'password'], req.body)) {
    return BadRequest('missing required fields', res)
  }

  const data = req.body

  // TODO:
  // - validate document

  const person = await PeopleRepository.findOne({ where: { document: data.document } })

  if (person) {
    return UnprocessableContent("document already registered", res)
  }

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
