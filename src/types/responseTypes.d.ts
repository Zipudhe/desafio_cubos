type SuccessPeopleCreation = {
  id: string,
  name: string,
  document: string,
  createdAt: Date,
  updatedAt: Date,
}

type SuccessAccountCreation = {
  id: string,
  branch: string,
  account: string,
  createdAt: Date,
  updateAt: Date
}

type SuccesAuth = {
  token: string
}
