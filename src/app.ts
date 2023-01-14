import express, { Application } from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import rateLimiter from 'express-rate-limit'
import helmet from 'helmet'
import cors from 'cors'
import mongoSanitize from 'express-mongo-sanitize'
import compression from 'compression'
import 'express-async-errors'
import fileUpload from 'express-fileupload'
import notFoundMiddleware from '@/middleware/notFound.middleware'
import errorHandlerMiddleware from '@/middleware/errorHandler.middleware'

import authRouter from '@/routes/auth.routes'
import scrumRouter from '@/routes/scrum.routes'

const app: Application = express()
app.set('trust proxy', 1)
app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000,
        max: 60,
    })
)

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(compression())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(mongoSanitize())
app.use(fileUpload({ useTempFiles: true }))

app.get('/', (req, res) => {
    res.status(200).send('Hello World!')
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/scrums', scrumRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

export default app
