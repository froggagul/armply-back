import UserModel, { UserDoc } from '../models/user';
import { ServiceResult } from '../util/generic';
import * as Password from '../util/password';
import User, { UserSignup } from '../modelType/user';

export async function create(profile: UserSignup):ServiceResult<'USER_EXISTS', User> {
    const existingUser = await UserModel.findOne({$and: [
        {email: profile.email},
        {loginType: profile.loginType},
      ]});
    console.log(existingUser);
      if (existingUser !== null) {
        return {
          success: false,
          reason: 'USER_EXISTS',
        };
      }
      if (profile.password) {
        const userObj = await UserModel.create(Object.assign(profile, {
          name: profile.username,
          password: await Password.hash(profile.password),
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        return {
          success: true,
          result: userObj
        };
      }
      const userObj = await UserModel.create(Object.assign(profile, {
          name: profile.username,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
      console.log('userobj', userObj);
      return {
        success: true,
        result: userObj
      };
};

export async function authenticate(email: string, password: string):
ServiceResult<'BAD_CREDENTIALS', User> {
  const user = await UserModel.findOne({email, loginType:'email'});
  if (!user) {
    return {
      success: false,
      reason: 'BAD_CREDENTIALS'
    };
  }
  if (user.password && !(await Password.verify(user.password, password))) {
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

/**
 * @description 해당 이메일을 쓰는 사용자가 존재하는지 확인합니다
 * @param email 이메일
 */
export async function emailView(email: string, type: 'email' | 'kakao' | 'facebook' | 'google'):
ServiceResult<'User_EXIST' | 'User_NEXIST', UserDoc> {
  const user = await UserModel.findOne({email, loginType: type});
  if(!user) {
    return {success: false, reason: 'User_NEXIST'};
  }
  return {success: true, reason: 'User_EXIST', result: user};
}
