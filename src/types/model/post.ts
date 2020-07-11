import { ObjectId } from 'bson';

export interface Post {
    title: string;
    content: string;
    author: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}