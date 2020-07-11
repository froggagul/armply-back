import { ObjectId } from 'bson';

export interface Post {
    title: string;
    content: string;
    author: ObjectId;
    isPrivate: Boolean;
    createdAt: Date;
    updatedAt: Date;
}