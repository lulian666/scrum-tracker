import { StatusCodes } from "http-status-codes"
import CustomError from "./custom.error"

class BadRequestError extends CustomError {
    constructor(message: string) {
        super(StatusCodes.BAD_REQUEST, message)
    }
}

export default BadRequestError