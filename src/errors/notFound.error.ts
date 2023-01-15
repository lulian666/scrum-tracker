import { StatusCodes } from "http-status-codes"
import CustomError from "./custom.error"

class NotFoundError extends CustomError {
    constructor(message: string) {
        super(StatusCodes.NOT_FOUND, message)
    }
}

export default NotFoundError