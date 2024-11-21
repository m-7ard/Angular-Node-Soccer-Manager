import { ValueError } from "@sinclair/typebox/build/cjs/errors";
import API_ERROR_CODES from "./API_ERROR_CODES";

class ApiErrorFactory {
    static typeBoxErrorToApiErrors(errors: ValueError[], pathPrefix: string[] = []) {
        const prefix = pathPrefix.length === 0 ? "" : `/${pathPrefix.join("/")}`;
        return errors.map((error) => ({
            message: error.message,
            path: prefix + error.path,
            code: API_ERROR_CODES.VALIDATION_ERROR,
        }));
    }

    static applicationErrorToApiErrors(errors: IApplicationError[], pathPrefix: string[] = []) {
        const prefix = pathPrefix.length === 0 ? "" : `/${pathPrefix.join("/")}`;
        return errors.map((error) => ({
            message: error.message,
            path: prefix + `/${error.path.join("/")}`,
            code: API_ERROR_CODES.APPLICATION_ERROR,
        }));
    }
}

export default ApiErrorFactory;
