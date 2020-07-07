import UserModel, { UserDoc } from '../models/user';
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
      return {
        success: true,
        result: userObj
      };
};

export async function authenticate(username: string, password: string):
ServiceResult<'BAD_CREDENTIALS', User> {
  const user = await UserModel.findOne({username});
  if (!user) {
    return {
      success: false,
      reason: 'BAD_CREDENTIALS'
    };
  }
  if (!(await Password.verify(user.password, password))) {
    return {
      success: false,
      reason: 'BAD_CREDENTIALS'
    };
  }
  return {
    success: true,
    result: user
  };
}

/**
 * @description 사용자 정보를 반환합니다.
 * @param username 사용자명
 */
export async function view(username: string):
ServiceResult<'USER_NEXIST', UserDoc> {
  const user = await UserModel.findOne({username});
  if (!user) {
    return {success: false, reason: 'USER_NEXIST'};
  }
  return {success: true, result: user};
}
