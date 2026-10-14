class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        Error.captureStackTrace?.(this, this.constructor);
    }
}

class BadRequestError extends AppError {
    constructor(message = "Bad request") {
        super(message, 400);
    }
}

class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}

class ConflictError extends AppError {
    constructor(message = "Resource conflict") {
        super(message, 409);
    }
}

module.exports = {
    AppError,
    BadRequestError,
    NotFoundError,
    ConflictError
};