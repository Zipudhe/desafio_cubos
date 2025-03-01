import { DataSourceOptions } from "typeorm"
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions"
import dotenv from 'dotenv'
dotenv.config()

export const getDbConnConfig: () => PostgresConnectionOptions = () => {
  const baseConfig: { type: "postgres" } & any = {
    type: "postgres",
  }

  // if DATABASE_URL provided
  if (process.env.DATABASE_URL) {
    return {
      ...baseConfig,
      url: process.env.DATABASE_URL,
    }
  }


  // if DB_* provided
  if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_NAME)
    return {
      ...baseConfig,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 5432) || undefined,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    }

  // else, throw
  throw new Error("Invalid DB config. Check environment variables")
}

export const getTypeOrmConfig = () => {

  return {
    synchronize: true,
    logging: false,
    migrations: ['src/migration/**/*.{ts,js}'],
    entities: ['src/entity/**/*.{ts,js}'],
  }
}

export const getConfig: () => DataSourceOptions = () => ({
  ...getDbConnConfig(),
  ...getTypeOrmConfig(),
})
