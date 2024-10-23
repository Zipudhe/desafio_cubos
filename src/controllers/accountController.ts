import { AppDataSource } from '../db/index'
import { Account } from '../entity/Account'

const AccountRepository = AppDataSource.getRepository(Account)

export const CreatePeople = async (data: NewAccount) => {

  const personId = "a4a8e8bd-665c-49e3-ab6f-1527a92e829b"

}
