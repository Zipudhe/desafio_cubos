type GenericResponse = {
  id: string,
  createdAt: string,
  updatedAt: string
}


type NewPerson = {
  name: string,
  document: string,
  password: string
}

type NewPersonResponse = GenericResponse & {
  name: string,
  document: string,
}

type NewAccount = {
  branch: string,
  account: string
}

type NewAccountResponse = GenericResponse & NewAccount

type NewCard = {
  type: string,
  number: string,
  cvv: string
}

type NewCardResponse = GenericResponse & NewCard

type NewTransaction = {
  value: string,
  description: string,
}

type NewInternalTransaction = NewTransaction & {
  receiverAccountId: string
}

type NewTransactionResponse = GenericResponse & NewTransaction

type NewInternalTransactionResponse = GenericResponse & NewInternalTransaction
