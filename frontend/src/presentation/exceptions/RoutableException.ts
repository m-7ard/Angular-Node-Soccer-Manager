class RoutableException extends Error {
    constructor(message: string, route: string) {
        super(message);
        this.route = route;
        this.name = this.constructor.name;
    }

    public route: string;
}

export default RoutableException;