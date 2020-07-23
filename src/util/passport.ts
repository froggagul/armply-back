import {Strategy as LocalStrategy} from 'passport-local';
import * as AuthService from '../services/auth';
import User from '../types/model/user';

/**
 * @description Local authentication strategy
 */
export const localStrategy = new LocalStrategy({
  passReqToCallback: true,
  passwordField: 'password',
  usernameField: 'email'
}, async (_, email, password, done) => {
  try {
    const result = await AuthService.authenticate(email, password);
    if (result.success) {
      return done(null, result.result!);
    } else {
      return done(result.reason);
    }
  } catch (err) {
    return done(err);
  }
});

/**
 * @description Serializes a `User` object to a `SerializedUser`
 * @param user `User` model object
 * @param done Callback function
 */
export const serialize = (user: User, done: any) => {
  console.log('se username:', user.username);
  done(null, user.username);
};

/**
 * @description Deserializes a `SerializedUser` to a `User` object
 * @param username `SerializedUser` seralized user
 * @param done Callback function
 */
export const deserialize = (username: string, done: any) => {
  console.log('de username:', username);
  AuthService.view(username).then(result => {
    if (!result.success) {
      done(result.reason!);
    } else {
      done(null, result.result!);
    }
  });
};