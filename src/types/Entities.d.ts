type GenericResponse = {
  id: string,
  createdAt: Date,
  updatedAt: Date
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


type CardType = 'physical' | 'virtual'

type NewCard = {
  type: CardType,
  number: string,
  cvv: string
}

type NewCardResponse = GenericResponse & NewCard

type TransactionType = 'credit' | 'debit'

type NewTransaction = {
  value: string,
  description: string,
}

type NewInternalTransaction = NewTransaction & {
  receiverAccountId: string
}

type NewTransactionResponse = GenericResponse & NewTransaction

type NewInternalTransactionResponse = GenericResponse & NewInternalTransaction
