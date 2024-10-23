import { AppDataSource } from '../db/index'
import { People } from '../entity/People'

const PeopleRepository = AppDataSource.getRepository(People)

export const CreatePeople = async (data: NewPerson) => {
  return PeopleRepository.create(data)
}
