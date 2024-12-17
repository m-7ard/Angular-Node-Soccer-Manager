import { HttpErrorResponse } from "@angular/common/http";
import ClientSideErrorException from "../exceptions/ClientSideErrorException";
import InternalServerErrorException from "../exceptions/InternalServerErrorException";
import NotFoundException from "../exceptions/NotFoundException";
import UnkownErrorException from "../exceptions/UnkownErrorException";

export default function getRoutableException(error: unknown) {
    if (!(error instanceof HttpErrorResponse)) {
        return new ClientSideErrorException(JSON.stringify(error));
    }

    if (error.status === 404) {
        return new NotFoundException(error.error[0]);
    } else if (error.status === 500) {
        return new InternalServerErrorException(error.error[0]);
    }

    return new UnkownErrorException();
}