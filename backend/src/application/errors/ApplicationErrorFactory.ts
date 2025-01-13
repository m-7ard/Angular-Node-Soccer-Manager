import IApplicationError from "./IApplicationError";

class ApplicationErrorFactory {
    static domainErrorsToApplicationErrors(errors: IDomainError[], pathPrefix: string[] = []): IApplicationError[] {
        return errors.map((error) => ({
            message: error.message,
            path: [...pathPrefix, ...error.path],
            code: "DOMAIN_ERROR",
            metadata: {
                type: error.code,
            },
        }));
    }

    static createSingleListError({ message, path, code }: { message: string; path: string[]; code: string }): [IApplicationError] {
        return [{
            message: message,
            path: path,
            code: code,
        }];
    }
}

export default ApplicationErrorFactory;
