import 'reflect-metadata'
import { DataSource } from "typeorm"

import { getConfig } from './config'

const config = getConfig()
export const AppDataSource = new DataSource(config)
