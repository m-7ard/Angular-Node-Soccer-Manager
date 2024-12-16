class User {
    constructor(props: { id: string; name: string; email: string; dateCreated: Date; isAdmin: boolean }) {
        this.id = props.id;
        this.name = props.name;
        this.email = props.email;
        this.dateCreated = props.dateCreated;
        this.isAdmin = props.isAdmin;
    }

    public id: string;
    public name: string;
    public email: string;
    public dateCreated: Date;
    public isAdmin: boolean;
}

export default User;
