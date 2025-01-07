const APPLICATION_ERROR_CODES = {
    StateMismatch: "StateMismatch",
    ModelDoesNotExist: "ModelDoesNotExist",
    IntegrityError: "IntegrityError",
    ModelAlreadyExists: "ModelAlreadyExists",
    OperationFailed: "OperationFailed",
    NotAllowed: "NotAllowed",
} as const;

export default APPLICATION_ERROR_CODES;