import { ObjectId } from 'bson';
import PostModel from '../models/post';
import { ServiceResult } from '../util/generic';
import { Post } from '../types/model/post';

export async function createPost(title: string, content: string, isPrivate: Boolean, isSent: Boolean, author: ObjectId):
ServiceResult<'USER_PERM', Post> {
  const newPost = await PostModel.create({
    title,
    content,
    author,
    isPrivate,
    isSent,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return {
    result: newPost,
    success: true
  };
}

export async function editPost(post: ObjectId, title: string, content: string, isPrivate: Boolean, isSent: Boolean, user: ObjectId):
ServiceResult<'POST_NEXIST'|'USER_PERM', Post> {
  const postObj = await PostModel.findById(post);
  if (!postObj) {
    return {reason: 'POST_NEXIST', success: false};
  }
  const hasEditPerm = user.equals(postObj.author as ObjectId);
  if (!hasEditPerm) {
    return {reason: 'USER_PERM', success: false};
  }
  postObj.title = title;
  postObj.content = content;
  postObj.isPrivate = isPrivate;
  postObj.isSent = isSent;
  await postObj.save();
  return {success: true};
}

export async function removePost(id: ObjectId, user?: ObjectId):
ServiceResult<'POST_NEXIST'|'USER_NEXIST'|'USER_PERM'> {
  const postObj = await PostModel.findById(id).select('author');
  if (!postObj) {
    return {reason: 'POST_NEXIST', success: false};
  }
  if (!(user === undefined || (postObj.author as ObjectId).equals(user))) {
    // const permResult = await AuthService.checkAdminPerm(user, AdminPermission.Board);
    // if (!permResult.success) {
    //   return {success: false, reason: permResult.reason};
    // } else if (!permResult.result) {
      
    // }
    return {success: false, reason: 'USER_PERM'};
  }
  // User authenticated past this point
  await postObj.remove();
  return {success: true};
}
