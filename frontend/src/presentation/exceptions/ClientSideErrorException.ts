import RoutableException from './RoutableException';

class ClientSideErrorException extends RoutableException {
    constructor() {
        super("", '/client-side-error/');
    }
}

export default ClientSideErrorException;