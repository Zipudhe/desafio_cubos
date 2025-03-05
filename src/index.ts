import express, { Response } from 'express'
import { AppDataSource } from '@db/index'
import dotenv from 'dotenv'

import router from '@routes/index'
import { ServerError } from '@handlers/ErrorHandler'

dotenv.config()

const app = express()
app.use(express.json())

const port = process.env.PORT ?? 3000

AppDataSource.initialize()
  .then(() => {
    console.log("Connected to database successfully")
    app.use('/', router)

  })
  .catch(err => {
    app.use('*', (_, res: Response) => ServerError('failed to connect to the database', res))
    console.log("failed to initialize database\n", err)
  })


app.listen(port, () => console.log("Server up and running on port: ", port))

