const VALIDATION_ERROR_CODES = {
    IsNull: "IsNull",
    StateMismatch: "StateMismatch",
    ModelDoesNotExist: "ModelDoesNotExist",
    IntegrityError: "IntegrityError",
    ModelAlreadyExists: "ModelAlreadyExists",
    Custom: "Custom",
    FileSizeExceeded: "FileSizeExceeded",
    FileInvalidExtension: "FileInvalidExtension",
    FileCountExceeded: "FileCountExceeded",
    FileNoFiles: "FileNoFiles",
} as const;

export default VALIDATION_ERROR_CODES;