class ApplicationErrorFactory {
    static domainErrorsToApplicationErrors(errors: IDomainError[], pathPrefix: string[] = []): IApplicationError[] {
        return errors.map((error) => ({
            message: error.message,
            path: [...pathPrefix, ...error.path],
            code: "DOMAIN_ERROR",
            metadata: {
                "type": error.code
            }
        }));
    }
}

export default ApplicationErrorFactory;
