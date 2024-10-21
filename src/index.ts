import express, { Response } from 'express'
import { AppDataSource } from './db/index'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.PORT ?? 3000

AppDataSource.initialize()
  .then(() => {
    console.log("database initialized")
  })
  .catch(err => {
    console.log("failed to initialize database")
  })
app.get("/", (_, res: Response) => {

  return res.send("Hello World")
})


app.listen(port, () => console.log("Server up and running on port: ", port))

