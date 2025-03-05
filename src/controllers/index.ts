import * as PeopleController from './peopleControler'
import * as AccountController from './accountController'
import * as AuthController from './authController'

export type GenericResponse = {
  id: string,
  createdAt: Date,
  updatedAt: Date
}


export type Person = {
  name: string,
  document: string,
  password: string
}

export type PersonResponse = GenericResponse & Omit<Person, "password">


export type Account = {
  branch: string,
  account: string
}

export type AccountResponse = GenericResponse & Account


export type CardType = 'physical' | 'virtual'

export type Card = {
  type: CardType,
  number: string,
  cvv: string
}

export type CardWithAuth = Card & { personId: string }

export type CardResponse = GenericResponse & Card

export type TransactionType = 'credit' | 'debit'

export type Transaction = {
  value: string,
  description: string,
}

export type InternalTransaction = Transaction & {
  receiverAccountId: string
}

export type TransactionResponse = GenericResponse & Transaction

export type InternalTransactionResponse = GenericResponse & InternalTransaction

export {
  PeopleController,
  AccountController,
  AuthController
}
