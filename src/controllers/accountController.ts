import { Request, Response } from 'express'
import { AppDataSource } from '../db/index'
import { Account } from '../entity/Account'
import { Card } from '../entity/Card'
import { People } from '../entity/People'
import { Transaction } from '../entity/Transaction'
import { BadRequest, UnprocessableContent, ServerError, NotFound } from '../handlers/ErrorHandler'
import { CreatedHandler, SuccesHandler } from '../handlers/SuccessHandler'
import { parseBalanceToFloat } from '../utils/balanceParser'
import { hasRequiredFields, isEmpty } from '../utils/validators'

const AccountRepository = AppDataSource.getRepository(Account)
const PeopleRepository = AppDataSource.getRepository(People)
const CardRepository = AppDataSource.getRepository(Card)
const TransactionRepository = AppDataSource.getRepository(Transaction)



export const createAccount = async (req: Request<{}, {}, NewAccount>, res: Response) => {
  const personId = "9bc14d10-e497-4f9d-9362-3f714d7bb4de" // extrair do token

  const accountRegex = /(\d{7}-\d{1})/
  const branchRegex = /(\d{3})/

  const { branch, account } = req.body

  if (!accountRegex.exec(account) || !branchRegex.exec(branch)) {
    return BadRequest("branch or account are invalid", res)
  }

  const person = await PeopleRepository.findOne({ where: { id: personId } })

  if (!person) {
    return NotFound("person id not found", res)
  }

  const newAccount = AccountRepository.create(req.body)
  newAccount.person = person

  return AccountRepository.save(newAccount)
    .then(createdAccount => {
      const {
        id,
        branch,
        account,
        createdAt,
        updatedAt
      } = createdAccount

      const newAccount = { id, branch, account, createdAt, updatedAt }

      CreatedHandler<NewAccountResponse>(newAccount, res)
    })
    .catch(error => UnprocessableContent(error.message, res))

}



export const getAccounts = async (req: Request<{}, {}, {}>, res: Response) => {
  const personId = "9bc14d10-e497-4f9d-9362-3f714d7bb4de" // extrair do token

  const accounts = await AccountRepository.find({
    select: {
      id: true,
      branch: true,
      account: true,
      createdAt: true,
      updatedAt: true,
    },
    where: {
      person: {
        id: personId
      }
    }
  })

  return SuccesHandler(accounts, res)
}


export const createAccountCard = async (req: Request<{ accountId: string }, {}, NewCard>, res: Response) => {

  const cardNumberRegex = /(\d{4}\s*){4}/
  const cvvRegex = /(\d{3})/

  const cardData = req.body

  const account = AccountRepository.exists({ where: { id: req.params.accountId } })

  if (!account) {
    return BadRequest("invalid account", res)
  }

  if (!cardNumberRegex.exec(cardData.number) || !cvvRegex.exec(cardData.cvv)) {
    return BadRequest("cvv or number are invalid", res)
  }

  if (cardData.type == 'physical') {
    const totalPhysicalCards = await CardRepository.count({
      select: {
        id: true,
      },
      where: {
        account: {
          id: req.params.accountId
        }
      }
    })

    if (totalPhysicalCards > 1) {
      return UnprocessableContent("already reached the limit of physical cards", res)
    }

  }

  const newCard = CardRepository.create(req.body)

  return CardRepository.save(newCard)
    .then(createdCard => {
      const cardCleaned = { ...createdCard, number: createdCard[0].number.slice(-4) }
      CreatedHandler(cardCleaned, res)
    })
    .catch(error => {
      UnprocessableContent(error.message, res)
    })
}

export const getAccountCards = async (req: Request<{ accountId: string }, {}, NewCardResponse[]>, res: Response) => {
  const account = await AccountRepository.exists({ where: { id: req.params.accountId } })

  if (!account) {
    return NotFound("invalid account", res)
  }

  await CardRepository.find({
    select: {
      id: true,
      type: true,
      number: true,
      createdAt: true,
      cvv: true,
      updatedAt: true
    },
    where: {
      account: {
        id: req.params.accountId
      }
    }
  })
    .then(cards => SuccesHandler<NewCardResponse[]>(cards, res))
    .catch(error => UnprocessableContent(error.message, res))
}

export const getAccountTransactions = async (req: Request<{ accountId: string }, {}, NewTransactionResponse>, res: Response) => {
  const account = await AccountRepository.exists({ where: { id: req.params.accountId } })

  if (!account) {
    return NotFound("invalid account", res)
  }

  TransactionRepository.find({
    select: {
      id: true,
      value: true,
      description: true,
      createdAt: true,
      updatedAt: true
    },
    where: {
      account: {
        id: req.params.accountId
      }
    }
  })
    .then(transactions => SuccesHandler(transactions, res))
    .catch(error => UnprocessableContent(error.message, res))
}

export const getAccountBalance = async (req: Request<{ accountId: string }, {}, { balance: number }>, res: Response) => {
  const account = await AccountRepository.findOne({
    select: {
      balance: true
    },
    where: { id: req.params.accountId }
  })
    .catch(error => {
      ServerError(error.message, res)
    })

  if (isEmpty(account)) {
    return NotFound("invalid account", res)
  }

  SuccesHandler(account, res)
}

export const createTransaction = async (req: Request<{ accountId: string }, {}, { value: string, description: string, type: TransactionType }>, res: Response) => {

  if (!hasRequiredFields(['type', 'value'], req.body)) {
    return BadRequest('missing required fields', res)
  }


  const account = await AccountRepository.findOne({
    select: {
      balance: true,
      id: true,
    },
    where: { id: req.params.accountId }
  })
    .catch(error => {
      ServerError(error.message, res)
    })


  if (isEmpty(account)) {
    return NotFound("invalid account", res)
  }

  const { value, type, description } = req.body
  const parasedValue = Number.parseFloat(value)

  const newTransaction = TransactionRepository.create({ description, value, type })

  if (type == 'debit') {
    const parsedAccountBalance = parseBalanceToFloat(account.balance)
    if (parsedAccountBalance + parasedValue < 0) {
      return UnprocessableContent("unsuficient balance", res)
    }

    return AppDataSource.transaction(async (manager) => {
      account.balance = parsedAccountBalance + parasedValue
      await manager.save(account)
      return await manager.save(newTransaction)
    })
      .then((result) => {
        delete result.type
        CreatedHandler(result, res)
      })
      .catch(error => UnprocessableContent(error.message, res))
  }


  if (parasedValue < 0) {
    return UnprocessableContent("credit can not be negative", res)
  }

  return TransactionRepository.save(newTransaction)
    .then((result) => CreatedHandler(result, res))
    .catch(error => UnprocessableContent(error.message, res))
}

export const createInternalTransaction = async (req: Request<{ accountId: string }, {}, { value: string, description: string, type: TransactionType, receiverAccountId: string }>, res: Response) => {
  const { type, description, receiverAccountId, value } = req.body
  const { accountId } = req.params

  const parasedValue = Number.parseFloat(value)

  if (parasedValue < 0) {
    return UnprocessableContent("for internal transactions value must be positive", res)
  }

  const [senderAccount, receiverAccount, error] = await Promise.all([
    AccountRepository.findOne({
      select: {
        balance: true,
        id: true,
      },
      where: { id: accountId }
    }),
    AccountRepository.findOne({
      select: {
        id: true,
        balance: true
      },
      where: { id: receiverAccountId }
    })
  ])
    .catch((error) => {
      return [{}, {}, error]
    })

  if (error) {
    return UnprocessableContent(error.message, res)
  }

  if (isEmpty(senderAccount)) {
    return NotFound("missing sender account", res)
  }

  if (isEmpty(receiverAccount)) {
    return NotFound("missing receiver account", res)
  }

  if (type == 'debit') {
    const parsedSenderAccountBalance = parseBalanceToFloat(senderAccount.balance)
    const parsedReceiverAccountBalance = parseBalanceToFloat(receiverAccount.balance)
    if (parsedSenderAccountBalance - parasedValue < 0) {
      return UnprocessableContent("unsuficient balance", res)
    }

    return AppDataSource.transaction(async (manager) => {
      senderAccount.balance = parsedSenderAccountBalance - parasedValue
      receiverAccount.balance = parsedReceiverAccountBalance + parasedValue

      await manager.save(senderAccount)
      await manager.save(receiverAccount)

      const newTransaction = TransactionRepository.create({ description, value, type, receiver_account: receiverAccount })

      return await manager.save(newTransaction)
    })
      .then((result) => {
        delete result.type
        delete result.receiver_account
        CreatedHandler(result, res)
      })
      .catch(error => UnprocessableContent(error.message, res))
  }

  return AppDataSource.transaction(async (manager) => {
    receiverAccount.balance += parasedValue

    await manager.save(receiverAccount)

    const newTransaction = TransactionRepository.create({ description, value, type, receiver_account: receiverAccount })

    return await manager.save(newTransaction)
  })
    .then((result) => {
      delete result.type
      delete result.receiver_account
      CreatedHandler(result, res)
    })
    .catch(error => UnprocessableContent(error.message, res))

}


export const revertTransaction = async (req: Request<{ accountId: string, transactionId: string }, {}, {}>, res: Response) => {
  // Checar se a transacao já foi revertida pelo "updatedAt"
  // Checar também se é uma trnsacao interna com receiver account

  const { accountId, transactionId } = req.params
  const [account, transaction, error] = await Promise.all([
    AccountRepository.findOne(
      {
        select: {
          id: true,
          balance: true
        },
        where: {
          id: accountId
        }
      }),
    TransactionRepository.findOne({
      select: {
        id: true,
        value: true,
        updatedAt: true,
        createdAt: true,
      },
      relations: {
        receiver_account: true
      },
      where: {
        id: transactionId
      }
    })
  ])
    .catch(error => [0, 0, error])

  if (!isEmpty(error)) {
    return UnprocessableContent(error.message, res)
  }

  if (isEmpty(account)) {
    return NotFound("Account not found", res)
  }

  if (isEmpty(transaction)) {
    return NotFound("Transaction not found", res)
  }


  const parsedTransactionValue = parseBalanceToFloat(transaction.value)
  const parsedAccountBalance = parseBalanceToFloat(account.balance)


  CreatedHandler("transaciton reversed", res)
}
