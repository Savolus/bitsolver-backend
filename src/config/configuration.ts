import { MongooseModuleOptions } from '@nestjs/mongoose'
import { config } from 'dotenv'
import { S3 } from 'aws-sdk'

config()

// App
export const SERVER_PORT = process.env.PORT ?? 3000

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

// AWS configs
export const AWS_KEY = process.env.AWS_KEY
export const AWS_SECRET = process.env.AWS_SECRET
export const AWS_BUCKET = process.env.AWS_BUCKET

export const AWS_BUCKET_URL = `https://${AWS_BUCKET}.s3.amazonaws.com`

export const s3 = new S3({
    accessKeyId: AWS_KEY,
    secretAccessKey: AWS_SECRET,
    params: {
        Bucket: AWS_BUCKET
    }
})