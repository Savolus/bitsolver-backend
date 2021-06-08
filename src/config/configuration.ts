import { MongooseModuleOptions } from '@nestjs/mongoose'
import { config } from 'dotenv'

config()

// App
export const SERVER_PORT = process.env.SERVER_PORT ?? 3000

// JWT
export const JWT_SECRET = process.env.JWT_SECRET

// DB configs
export const MONGO_USER = process.env.MONGO_USER
export const MONGO_PASSWORD = process.env.MONGO_PASSWORD
export const MONGO_DATABASE = process.env.MONGO_DATABASE
export const MONGO_CLUSTER = process.env.MONGO_CLUSTER
export const MONGO_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_CLUSTER}/${MONGO_DATABASE}?retryWrites=true&w=majority`
export const MONGO_OPTIONS: MongooseModuleOptions = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
}
