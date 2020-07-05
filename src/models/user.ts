import mongo from 'mongoose';

const schema = new mongo.Schema({
  email: {required: true, type: String},
  name: {required: true, type: String},
  phone: {required: true, type: String},
  username: {required: true, type: String},
  password: {required: true, type: String},
  type: {default: 'user', enum: ['user', 'manager'], required: true, type: String}
});

schema.index('username');

const UserModel = mongo.model('User', schema);
export default UserModel;
