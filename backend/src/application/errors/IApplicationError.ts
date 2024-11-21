interface IApplicationError {
    code: string;
    path: Array<string>;
    message: string;
    metadata?: Record<string, string>
}