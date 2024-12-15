import IUserSchema from "infrastructure/dbSchemas/IUserSchema";

class UserDbEntity implements IUserSchema {
    private readonly __type: "USER_DOMAIN" = null!;

    constructor(props: { id: string; name: string; email: string; hashed_password: string; date_created: Date; is_admin: 1 | 0 }) {
        this.id = props.id;
        this.name = props.name;
        this.email = props.email;
        this.hashed_password = props.hashed_password;
        this.date_created = props.date_created;
        this.is_admin = props.is_admin;
    }

    public id: string;
    public name: string;
    public email: string;
    public hashed_password: string;
    public date_created: Date;
    public is_admin: 0 | 1;
}

export default UserDbEntity;