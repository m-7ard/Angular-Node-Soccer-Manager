import { ValueError } from "@sinclair/typebox/build/cjs/errors";
import API_ERROR_CODES from "./API_ERROR_CODES";
import { Failure } from "superstruct";
import IApiError from "./IApiError";

class ApiErrorFactory {
    static typeBoxErrorToApiErrors(errors: ValueError[], pathPrefix: string[] = []) {
        const prefix = pathPrefix.length === 0 ? "" : `/${pathPrefix.join("/")}`;
        return errors.map((error) => ({
            message: error.message,
            path: prefix + error.path,
            code: API_ERROR_CODES.VALIDATION_ERROR,
        }));
    }

    static superstructFailureToApiErrors(errors: Array<Failure>, pathPrefix: string[] = []) {
        const prefix = pathPrefix.length === 0 ? "" : `${pathPrefix.join("/")}`;
        return errors.map((error) => ({
            message: error.message,
            path: "/" + prefix + error.path,
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

    static createSingleErrorList(props: { message: string; path: string; code: string }): [IApiError] {
        return [{ message: props.message, path: props.path, code: props.code }];
    }
}

export default ApiErrorFactory;
