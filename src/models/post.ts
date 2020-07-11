import mongo from 'mongoose';
import { ObjectId } from 'bson';
import { Post } from '../types/model/post';

const schema = new mongo.Schema<Post>({
  title: {required: true, type: String},
  content: {required: true, type: String},
  author: {ref: 'User', required: true, type: ObjectId}
}, {timestamps: true});

const PostModel = mongo.model<Post & mongo.TimestampedDocument>('Post', schema);
export default PostModel;