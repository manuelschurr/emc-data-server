import User, { UserModel } from '../model/User';

export default class UserRepo {
   public static findOne(username: string): Promise<User> {
      return UserModel.findOne({ username: username }).lean<User>().exec();
   }

   public static async create(user: User): Promise<{ user: User }> {
      const createdUser = await UserModel.create(user);
      return { user: createdUser.toObject() };
   }
}