import { StatusCodes } from "http-status-codes"
import CustomError from "./custom.error"

class Unauthorized extends CustomError {
    constructor(message: string) {
        super(StatusCodes.FORBIDDEN, message)
    }
}

export default Unauthorized