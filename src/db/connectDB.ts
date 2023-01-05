import mongoose from "mongoose"

const connectDB = (url: string): Promise<typeof mongoose> => {
    return mongoose
        .set('strictQuery', false)
        .connect(url)
}

export default connectDB