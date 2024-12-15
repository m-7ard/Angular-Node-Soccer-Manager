const VALIDATION_ERROR_CODES = {
    IsNull: "IsNull",
    StateMismatch: "StateMismatch",
    ModelDoesNotExist: "ModelDoesNotExist",
    IntegrityError: "IntegrityError",
    ModelAlreadyExists: "ModelAlreadyExists",
    Custom: "Custom",
    InvalidValue: "InvalidValue",
    FileSizeExceeded: "FileSizeExceeded",
    FileInvalidExtension: "FileInvalidExtension",
    FileCountExceeded: "FileCountExceeded",
    OperationFailed: "OperationFailed",
} as const;

export default VALIDATION_ERROR_CODES;