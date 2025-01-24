const APPLICATION_ERROR_CODES = {
    StateMismatch: "StateMismatch",
    IntegrityError: "IntegrityError",
    ModelAlreadyExists: "ModelAlreadyExists",
    OperationFailed: "OperationFailed",
    NotAllowed: "NotAllowed",
} as const;

export default APPLICATION_ERROR_CODES;