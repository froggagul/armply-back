import mongo from 'mongoose';
import User from '../types/model/user';

const schema = new mongo.Schema<User>({
  email: {required: true, type: String},
  name: {required: true, type: String},
  username: {required: true, type: String},
  password: {type: String},
  type: {default: 'user', enum: ['user', 'manager'], required: true, type: String},
  loginType: {default: 'email', enum: ['email', 'kakao', 'facebook', 'google'], required: true, type: String}
});

schema.index('username');

export type UserDoc = User & mongo.Document;

const UserModel = mongo.model<UserDoc>('User', schema);
export default UserModel;
