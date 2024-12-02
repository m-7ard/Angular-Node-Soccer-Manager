abstract class DomainEvent {
    public readonly id: string;
    public readonly createdAt: Date;

    constructor() {
        this.id = crypto.randomUUID();
        this.createdAt = new Date();
    }

    abstract EVENT_TYPE: string;
    abstract payload: unknown;
}

export default DomainEvent;
