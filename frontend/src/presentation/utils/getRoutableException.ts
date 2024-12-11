import { HttpErrorResponse } from "@angular/common/http";
import ClientSideErrorException from "../exceptions/ClientSideErrorException";
import InternalServerErrorException from "../exceptions/InternalServerErrorException";
import NotFoundException from "../exceptions/NotFoundException";
import UnkownErrorException from "../exceptions/UnkownErrorException";

export default function getRoutableException(error: unknown) {
    if (!(error instanceof HttpErrorResponse)) {
        throw new ClientSideErrorException();
    }

    if (error.status === 404) {
        throw new NotFoundException(error.error[0]);
    } else if (error.status === 500) {
        throw new InternalServerErrorException(error.error[0]);
    }

    throw new UnkownErrorException();
}