import { mongodb } from '@saibotsivad/mongodb'

export const db = mongodb({
    apiKey: process.env.MONGODB_DATA_API_KEY,
    apiUrl: `https://eu-west-2.aws.data.mongodb-api.com/app/${process.env.MONGODB_APP_ID}/endpoint/data/v1`,
    dataSource: process.env.MONGODB_DATASOURCE,
    database: process.env.MONGODB_DATABASE
})