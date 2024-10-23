import { Request, Response } from 'express'
import { AppDataSource } from '../db/index'
import { People } from '../entity/People'
import { BadRequest, UnprocessableContent, ServerError } from '../handlers/ErrorHandler'
import { CreatedHandler } from '../handlers/SuccessHandler'
import { hasRequiredFields } from '../utils/validators'

const PeopleRepository = AppDataSource.getRepository(People)

export const CreatePeople = async (req: Request<{}, {}, NewPerson>, res: Response) => {

  if (!hasRequiredFields(['name', 'document', 'password'], req.body)) {
    return BadRequest('missing required fields', res)
  }

  const data = req.body

  const person = await PeopleRepository.findOne({ where: { document: data.document } })

  if (person) {
    return UnprocessableContent("document already registered", res)
  }

  const newPerson = PeopleRepository.create(data)

  PeopleRepository.save(newPerson)
    .then((person) => CreatedHandler<People>(person, res))
    .catch(error => {
      ServerError(error.message, res)
    })
}
