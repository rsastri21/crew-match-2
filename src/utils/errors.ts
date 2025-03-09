export class PublicError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class AuthenticationError extends PublicError {
    constructor() {
        super("You must be logged in to view this content");
        this.name = "AuthenticationError";
    }
}

export class AdminError extends PublicError {
    constructor() {
        super("You must be an admin to perform this operation");
        this.name = "AdminError";
    }
}

export class EmailInUseError extends PublicError {
    constructor() {
        super("Email is already in use");
        this.name = "EmailInUseError";
    }
}

export class NotFoundError extends PublicError {
    constructor() {
        super("Resource not found");
        this.name = "NotFoundError";
    }
}

export class TokenExpiredError extends PublicError {
    constructor() {
        super("Token has expired");
        this.name = "TokenExpiredError";
    }
}

export class LoginError extends PublicError {
    constructor() {
        super("Invalid email or password");
        this.name = "LoginError";
    }
}

export class AccountNotFoundError extends PublicError {
    constructor() {
        super("Account not found");
        this.name = "AccountNotFoundError";
    }
}

export class IncorrectAccountTypeError extends PublicError {
    constructor() {
        super(
            "Account is not of type email. Try signing in with Google or Slack."
        );
        this.name = "IncorrectAccountTypeError";
    }
}
