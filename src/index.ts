import express, { Response } from 'express'
import { AppDataSource } from './db/index'
import dotenv from 'dotenv'

import { router } from './routes/index'

dotenv.config()

const app = express()
app.use(express.json())

const port = process.env.PORT ?? 3000

AppDataSource.initialize()
  .then(() => {
    app.use('/', router)
  })
  .catch(err => {
    console.log("failed to initialize database")
  })


app.listen(port, () => console.log("Server up and running on port: ", port))

