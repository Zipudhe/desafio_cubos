import Express, { Request, Response } from 'express'

import { CreatedHandler } from '../handlers/SuccessHandler'

export const router = Express.Router()

type PersonData = {
  name: string,
  document: string,
  password: string
}

router.post('/', (req: Request<{}, {}, PersonData>, res: Response) => {
  const payload = req.body
  console.log({ payload })
  const mockedPeople = {
    id: 'some_id',
    name: payload.name,
    document: payload.document,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  CreatedHandler<SuccessPeopleCreation>(mockedPeople, res)
})
