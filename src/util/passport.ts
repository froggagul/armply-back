import {Strategy as LocalStrategy} from 'passport-local';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import {Strategy as FacebookStrategy} from 'passport-facebook';
import * as AuthService from '../services/auth';
import User, { UserSignup } from '../modelType/user';
import dotenv from 'dotenv';
import { UserDoc } from '../models/user';

dotenv.config();

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
export const googleStrategy = new GoogleStrategy({
  clientID: process.env.GOOGLE_ID || '',
  clientSecret: process.env.GOOGLE_SECRET || '',
  callbackURL: '/auth/google/redirect'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('profile:', profile);
    console.log('emails:', profile._json.email);
    const email = profile._json.email;
    if (email) {
      const result = await AuthService.emailView(email, 'google');
      if (result.success) {
        return done(undefined, result.result);
      } else {
        const userProfile = {
          username: profile.displayName,
          name: profile.displayName,
          email: email,
          type: 'user',
          loginType: 'google'
        };
        const result = await AuthService.create(userProfile as UserSignup);
        return done(undefined, result.result);
      }
    }
  } catch (err) {
    return done(err);
  }
});

export const facebookStrategy = new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID || '',
  clientSecret: process.env.FACEBOOK_SECRET || '',
  callbackURL: '/auth/facebook/redirect',
  profileFields: ['displayName', 'id', 'emails', 'name']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('profile:', profile);
    const email = profile._json.email;
    if (email) {
      const result = await AuthService.emailView(email, 'facebook');
      if (result.success) {
        return done(undefined, result.result);
      } else {
        const userProfile = {
          username: profile.displayName,
          name: profile.displayName,
          email: email,
          type: 'user',
          loginType: 'facebook'
        };
        const result = await AuthService.create(userProfile as UserSignup);
        return done(undefined, result.result);
      }
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
  console.log('se username:', user);
  done(null, user);
};

/**
 * @description Deserializes a `SerializedUser` to a `User` object
 * @param username `SerializedUser` seralized user
 * @param done Callback function
 */
export const deserialize = (user: UserDoc, done: any) => {
  console.log('de username:', user);
  AuthService.emailView(user.email, user.loginType).then(result => {
    if (!result.success) {
      done(result.reason!);
    } else {
      done(null, result.result!);
    }
  });
};