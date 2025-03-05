import { Request, Response } from 'express'
import { AppDataSource } from '../db/index'
import { Account as AccountEntity } from '../entity/Account'
import { Card as CardEntity } from '../entity/Card'
import { People } from '../entity/People'
import { Transaction } from '../entity/Transaction'

import { BadRequest, UnprocessableContent, NotFound } from '../handlers/ErrorHandler'
import { CreatedHandler, SuccesHandler } from '../handlers/SuccessHandler'
import { hasRequiredFields, isEmpty } from '../utils/validators'
import { parseBalanceToFloat } from '../utils/balanceParser'

import { Account, AccountResponse, CardResponse, TransactionResponse, TransactionType, CardWithAuth } from './index'

const AccountRepository = AppDataSource.getRepository(AccountEntity)
const PeopleRepository = AppDataSource.getRepository(People)
const CardRepository = AppDataSource.getRepository(CardEntity)
const TransactionRepository = AppDataSource.getRepository(Transaction)

export const createAccount = async (req: Request<{}, {}, Account & { personId: string }>, res: Response) => {

  const accountRegex = /(\d{7}-\d{1})/
  const branchRegex = /(\d{3})/

  const { branch, account, personId } = req.body

  if (!accountRegex.exec(account) || !branchRegex.exec(branch)) {
    return BadRequest("branch or account are invalid", res)
  }

  const person = await PeopleRepository.findOne({ where: { id: personId } })

  if (!person) {
    return NotFound("person not found", res)
  }

  const newAccount = AccountRepository.create(req.body)
  newAccount.person = person

  return AccountRepository.save({ ...newAccount, balance: 0.00 })
    .then(createdAccount => {
      const {
        id,
        branch,
        account,
        createdAt,
        updatedAt
      } = createdAccount

      const newAccount = { id, branch, account, createdAt, updatedAt }

      CreatedHandler<AccountResponse>(newAccount, res)
    })
    .catch(error => UnprocessableContent(error.message, res))

}

export const getAccounts = async (req: Request<{}, {}, { personId: string }>, res: Response) => {
  const { personId } = req.body

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

  SuccesHandler(accounts, res)
}

export const createAccountCard = async (req: Request<{ accountId: string }, {}, CardWithAuth>, res: Response<void>) => {

  const cardNumberRegex = /(\d{4}\s*){4}/
  const cvvRegex = /(\d{3})/

  const { number, cvv, type, personId } = req.body
  const { accountId } = req.params
  const cardPayload = {
    number,
    cvv,
    type
  }

  const account = await AccountRepository.findOne({
    relations: {
      person: true
    },
    select: {
      person: {
        id: true
      }
    },
    where: { id: accountId }
  }) // Dessa forma é possível personalizar o erro

  if (isEmpty(account)) {
    return BadRequest("invalid account", res)
  }

  if (account.person.id != personId) {
    return res.sendStatus(403)
  }


  if (!cardNumberRegex.exec(number) || !cvvRegex.exec(cvv)) {
    return BadRequest("cvv or number are invalid", res)
  }

  const cardExists = await CardRepository.exists({
    where: {
      number: number
    }
  })

  if (cardExists) {
    return UnprocessableContent("card is already registered", res)
  }

  if (type == 'physical') {
    const totalPhysicalCards = await CardRepository.count({
      select: {
        id: true,
      },
      where: {
        account: {
          id: accountId
        }
      }
    })

    if (totalPhysicalCards > 1) {
      return UnprocessableContent("already reached the limit of physical cards", res)
    }

  }

  const newCard = CardRepository.create(cardPayload)
  newCard.account = account

  CardRepository.save(newCard)
    .then(createdCard => {
      delete createdCard['account']
      const cardCleaned = { ...createdCard, number: createdCard.number.slice(-4) }
      CreatedHandler(cardCleaned, res)
    })
    .catch(error => {
      UnprocessableContent(error.message, res)
    })

  return
}

export const getAccountCards = async (req: Request<{ accountId: string }, CardResponse[], { personId: string }, { itemsPerPage: number, currentPage: number }>, res: Response) => {
  const { accountId } = req.params

  const itemsPerPage = req.query.itemsPerPage ?? 10
  const page = req.query.currentPage ?? 1
  const currentPage = (page - 1) * itemsPerPage

  const account = await AccountRepository.findOne({
    relations: {
      person: true
    },
    select: {
      person: {
        id: true
      }
    },
    where: { id: accountId }
  }) // Dessa forma é possível personalizar o erro

  if (!account) {
    return NotFound("invalid account", res)
  }

  if (account.person.id != req.body.personId) {
    return res.sendStatus(403)
  }


  return CardRepository.find({
    select: {
      id: true,
      type: true,
      createdAt: true,
      updatedAt: true,
      cvv: true,
      number: true
    },
    take: itemsPerPage,
    skip: currentPage,
    where: { account: { id: accountId } }
  })
    .then(cards => {
      return cards.map(card => ({
        ...card,
        number: card.number.slice(-4)
      }));

    })
    .then(cards => SuccesHandler<CardResponse[]>(cards, res))
    .catch(error => UnprocessableContent(error.message, res))
}

export const getAccountTransactions = async (req: Request<{ accountId: string }, {}, { personId: string }, { itemsPerPage: number, currentPage: number }>, res: Response<TransactionResponse[]>) => {
  const { accountId } = req.params

  const account = await AccountRepository.findOne({
    relations: {
      person: true
    },
    select: {
      person: {
        id: true
      }
    },
    where: { id: accountId }
  })

  const itemsPerPage = req.query.itemsPerPage ?? 10
  const page = req.query.currentPage ?? 1
  const currentPage = (page - 1) * itemsPerPage

  if (!account) {
    return NotFound("invalid account", res)
  }

  if (account.person.id != req.body.personId) {
    return res.sendStatus(403)
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
    },
    skip: currentPage,
    take: itemsPerPage
  })
    .then(transactions => SuccesHandler(transactions, res))
    .catch(error => UnprocessableContent(error.message, res))
}

export const getAccountBalance = async (req: Request<{ accountId: string }, {}, { personId: string }>, res: Response<{ balance: number }>) => {

  const { personId } = req.body

  const account = await AccountRepository.findOne({
    relations: {
      person: true,
    },
    select: {
      balance: true,
      person: { id: true }
    },
    where: { id: req.params.accountId }
  })

  if (isEmpty(account)) {
    return NotFound("invalid account", res)
  }


  if (account.person.id != personId) {
    return res.sendStatus(403)
  }

  return SuccesHandler(account, res)
}

export const createTransaction = async (req: Request<{ accountId: string }, {}, { value: string, description: string, type: TransactionType, personId: string }>, res: Response) => {

  if (!hasRequiredFields(['type', 'value'], req.body)) {
    return BadRequest('missing required fields', res)
  }


  const account = await AccountRepository.findOne({
    relations: {
      person: true,
    },
    select: {
      balance: true,
      id: true,
      person: { id: true }
    },
    where: { id: req.params.accountId }
  })


  if (!account) {
    return NotFound("invalid account", res)
  }

  if (account.person.id != req.body.personId) {
    return res.sendStatus(403)
  }

  const { value, type, description } = req.body

  const parsedValue = Number.parseFloat(value)
  const positiveValue = parsedValue < 0 ? parsedValue * -1 : parsedValue

  const newTransaction = TransactionRepository.create({ description, value: `${positiveValue}`, type, account })

  if (type == 'debit') {
    const parsedAccountBalance = parseBalanceToFloat(account.balance)
    const updatedBalance = parsedAccountBalance - positiveValue

    if (updatedBalance < 0) {
      return UnprocessableContent("unsuficient balance", res)
    }

    return AppDataSource.transaction(async (manager) => {
      account.balance = updatedBalance
      await manager.save(account)
      return await manager.save(newTransaction)
    })
      .then((result) => {
        delete result.type
        delete result.account
        CreatedHandler(result, res)
      })
      .catch(error => UnprocessableContent(error.message, res))
  }


  const parsedAccountBalance = parseBalanceToFloat(account.balance)
  const updatedBalance = parsedAccountBalance + positiveValue

  return AppDataSource.transaction(async (manager) => {
    account.balance = updatedBalance
    await manager.save(account)
    return await manager.save(newTransaction)
  })
    .then((result) => {
      delete result.type
      delete result.account
      CreatedHandler(result, res)
    })
    .catch(error => UnprocessableContent(error.message, res))
}

export const createInternalTransaction = async (req: Request<{ accountId: string }, {}, { value: string, description: string, type: TransactionType, receiverAccountId: string, personId: string }>, res: Response) => {
  const { type, description, receiverAccountId, personId } = req.body
  const { accountId } = req.params

  const [senderAccount, receiverAccount, error] = await Promise.all([
    AccountRepository.findOne({
      relations: {
        person: true,
      },
      select: {
        balance: true,
        id: true,
        person: { id: true }
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

  if (senderAccount.person.id != personId) {
    return res.sendStatus(403)
  }

  if (isEmpty(receiverAccount)) {
    return NotFound("missing receiver account", res)
  }


  const parsedValue = Number.parseFloat(req.body.value)
  const value = parsedValue < 0 ? parsedValue * -1 : parsedValue

  const newTransaction = TransactionRepository.create({ description, value: `${value}`, type, receiver_account: receiverAccount, account: senderAccount })

  if (type == 'debit') {

    const updatedSenderBalance = senderAccount.balance + value
    const updatedReceiverBalance = receiverAccount.balance - value

    if (updatedSenderBalance < 0) {
      return UnprocessableContent("unsuficient balance", res)
    }

    return AppDataSource.transaction(async (manager) => {
      senderAccount.balance = updatedSenderBalance
      receiverAccount.balance = updatedReceiverBalance

      await manager.save(senderAccount)
      await manager.save(receiverAccount)

      return await manager.save(newTransaction)
    })
      .then((result) => {
        delete result.type
        delete result.receiver_account
        delete result.account
        CreatedHandler(result, res)
      })
      .catch(error => UnprocessableContent(error.message, res))
  }

  const updatedSenderBalance = senderAccount.balance - value
  const updatedReceiverBalance = receiverAccount.balance + value

  if (updatedReceiverBalance < 0) {
    return UnprocessableContent('insuficcient balance', res)
  }

  return AppDataSource.transaction(async (manager) => {


    receiverAccount.balance = updatedReceiverBalance
    senderAccount.balance = updatedSenderBalance

    await manager.save(receiverAccount)
    await manager.save(senderAccount)

    return await manager.save(newTransaction)
  })
    .then((result) => {
      delete result.type
      delete result.receiver_account
      delete result.account
      CreatedHandler(result, res)
    })
    .catch(error => UnprocessableContent(error.message, res))

}


export const revertTransaction = async (req: Request<{ accountId: string, transactionId: string }, {}, { personId: string }>, res: Response) => {
  const { accountId, transactionId } = req.params
  const { personId } = req.body

  const [account, transaction, error] = await Promise.all([
    AccountRepository.findOne(
      {
        relations: {
          person: true,
        },
        select: {
          id: true,
          balance: true,
          person: { id: true }
        },
        where: {
          id: accountId
        }
      }),
    TransactionRepository.findOne({
      select: {
        id: true,
        value: true,
        type: true,
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
    .catch(error => {
      return [0, 0, error]
    })

  if (!isEmpty(error)) {
    return UnprocessableContent(error.message, res)
  }

  if (isEmpty(account)) {
    return NotFound("Account not found", res)
  }

  if (account.person.id != personId) {
    return res.sendStatus(403)
  }

  if (isEmpty(transaction)) {
    return NotFound("Transaction not found", res)
  }

  const parsedTransactionValue = parseBalanceToFloat(transaction.value)
  const parsedAccountBalance = parseBalanceToFloat(account.balance)

  const { createdAt, updatedAt } = transaction

  if (createdAt.getTime() != updatedAt.getTime()) {
    return UnprocessableContent("transaction has already been reverted", res)
  }

  transaction.description = "Estorno de cobrança indevida"

  if (transaction.receiver_account) {
    const receiverAccount = await AccountRepository.findOne({
      select: {
        balance: true
      },
      where: {
        id: transaction.receiver_account
      }
    })

    if (transaction.type == 'credit') {

      const receiverAccountUpdatedBalance = receiverAccount.balance - parsedTransactionValue
      const senderAccountBalance = parsedAccountBalance + parsedTransactionValue

      if (receiverAccountUpdatedBalance > 0) {
        receiverAccount.balance = receiverAccountUpdatedBalance
        account.balance = senderAccountBalance

        return AppDataSource.transaction(async manager => {
          await manager.save(receiverAccount)
          await manager.save(account)
          return await manager.save(transaction)
        })
          .then(updatedTransaction => {
            delete updatedTransaction['type']
            SuccesHandler(updatedTransaction, res)
          })
          .catch(error => {
            UnprocessableContent(error.message, res)
          })
      }

      return UnprocessableContent("Account with not enought balance", res)
    }

    const receiverAccountUpdatedBalance = receiverAccount.balance + parsedTransactionValue
    const senderAccountBalance = account.balance - parsedTransactionValue

    if (senderAccountBalance > 0) {
      receiverAccount.balance = receiverAccountUpdatedBalance
      account.balance = senderAccountBalance
      return AppDataSource.transaction(async manager => {
        await manager.save(receiverAccount)
        await manager.save(account)
        return await manager.save(transaction)
      })
        .then(updatedTransaction => {
          delete updatedTransaction['type']
          SuccesHandler(updatedTransaction, res)
        })
        .catch(error => {
          UnprocessableContent(error.message, res)
        })
    }

    return UnprocessableContent("Account with not enought balance", res)
  }

  if (transaction.type == 'credit') {

    const updatedAccountBalance = parsedAccountBalance - parsedTransactionValue

    if (updatedAccountBalance >= 0) {
      account.balance = updatedAccountBalance
      return AppDataSource.transaction(async manager => {
        await manager.save(account)
        return await manager.save(transaction)
      })
        .then(updatedTransaction => {
          delete updatedTransaction['type']
          SuccesHandler(updatedTransaction, res)
        })
        .catch(error => {
          UnprocessableContent(error.message, res)
        })
    }

    return UnprocessableContent("Account with not enought balance", res)
  }


  const updatedAccountBalance = parsedAccountBalance + parsedTransactionValue
  account.balance = updatedAccountBalance


  return AppDataSource.transaction(async manager => {
    await manager.save(account)
    return await manager.save(transaction)
  })
    .then(updatedTransaction => {
      delete updatedTransaction['type']
      SuccesHandler(updatedTransaction, res)
    })
    .catch(error => {
      UnprocessableContent(error.message, res)
    })
}


