import mongo from 'mongoose';
import { ObjectId } from 'bson';
import { Post } from '../modelType/post';

const schema = new mongo.Schema<Post>({
  content: {required: true, type: String},
  author: {ref: 'User', required: true, type: ObjectId},
  isPrivate: {required: true, type: Boolean},
  isSent: {required: true, type: Boolean}
}, {timestamps: true});

const PostModel = mongo.model<Post & mongo.Document>('Post', schema);
export default PostModel;