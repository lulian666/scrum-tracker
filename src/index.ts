import app from './app'
import 'dotenv/config'
import 'module-alias/register'
import connectDB from './db/connectDB'

const PORT: number = Number(process.env.PORT) || 3000
const start = async () => {
    try {
        await connectDB(String(process.env.MONGO_URL))
        app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
    } catch (error) {
        console.log(error)
    }
}

start()
