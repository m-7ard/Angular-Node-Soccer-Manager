import User from "domain/entities/User";

class UserFactory {
    static CreateNew(props: { id: string; name: string; email: string; hashedPassword: string; isAdmin: boolean }) {
        return new User({
            id: props.id,
            name: props.name,
            email: props.email,
            hashedPassword: props.hashedPassword,
            dateCreated: new Date(),
            isAdmin: props.isAdmin,
        });
    }

    static CreateExisting(props: { id: string; name: string; email: string; hashedPassword: string; dateCreated: Date; isAdmin: boolean }) {
        return new User({
            id: props.id,
            name: props.name,
            email: props.email,
            hashedPassword: props.hashedPassword,
            dateCreated: props.dateCreated,
            isAdmin: props.isAdmin,
        });
    }
}

export default UserFactory;
