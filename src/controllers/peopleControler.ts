import { AppDataSource } from '../db/index'
import { People } from '../entity/People'

const PeopleRepository = AppDataSource.getRepository(People)

export const CreatePeople = async (data: NewPerson) => {

  const person = await PeopleRepository.findOne({ where: { document: data.document } })

  if (person) {
    throw {
      code: 422,
      message: 'Document already exists'
    }
  }

  const newPerson = PeopleRepository.create(data)

  return PeopleRepository.save(newPerson)
}
