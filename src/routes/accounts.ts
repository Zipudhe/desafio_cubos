import Express from 'express'

import { AccountController } from '../controllers'

export const router = Express.Router()

router.post('/', AccountController.createAccount)

router.post('/:accountId/cards', AccountController.createAccountCard)

router.post('/:accountId/transactions', AccountController.createTransaction)

router.post('/:accountId/transactions/internal', AccountController.createInternalTransaction)

router.post('/:accountId/transactions/:transactionId/revert', AccountController.revertTransaction)

router.get('/', AccountController.getAccounts)

router.get('/:accountId/cards', AccountController.getAccountCards)

router.get('/:accountId/transactions', AccountController.getAccountTransactions)

router.get('/:accountId/balance', AccountController.getAccountBalance)
