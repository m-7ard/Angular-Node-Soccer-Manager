import IUserApiModel from '../apiModels/IUserApiModel';
import User from '../models/User';

class UserMapper {
    static apiModelToDomain(source: IUserApiModel) {
        return new User({
            id: source.id,
            email: source.email,
            name: source.name,
            dateCreated: new Date(source.dateCreated),
            isAdmin: source.isAdmin
        });
    }
}

export default UserMapper;