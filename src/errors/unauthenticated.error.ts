import { StatusCodes } from "http-status-codes"
import CustomError from "./custom.error"

class UnauthenticatedError extends CustomError {
    constructor(message: string) {
        super(StatusCodes.UNAUTHORIZED, message)
    }
}

export default UnauthenticatedError