import UserModel from '../models/user';
import { ServiceResult } from '../util/generic';
import * as Password from '../util/password';
import User, { UserSignup } from '../types/model/user';

export async function create(profile: UserSignup):ServiceResult<'USERNAME_EXISTS' | 'EMAIL_EXISTS' | 'IMPKEY_EXISTS', User> {
    const existingUser = await UserModel.findOne({$or: [
        {username: profile.username},
        {email: profile.email}
      ]});
      if (existingUser !== null) {
        if (existingUser.username === profile.username) {
          return {
            success: false,
            reason: 'USERNAME_EXISTS'
          };
        } else if (existingUser.email === profile.email) {
          return {
            success: false,
            reason: 'EMAIL_EXISTS'
          };
        } else {
          return {
            success: false,
            reason: 'IMPKEY_EXISTS'
          };
        }
      }
      const userObj = await UserModel.create(Object.assign(profile, {
        password: await Password.hash(profile.password),
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      console.log(userObj);
      return {
        success: true,
        result: userObj
      };
};
