import { ObjectId } from 'bson';
import User from './user';

export interface Post {
    content: string;
    author: User |  ObjectId;
    isPrivate: Boolean;
    isSent: Boolean;
    createdAt: Date;
    updatedAt: Date;
}
