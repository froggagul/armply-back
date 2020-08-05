import { ObjectId } from 'bson';
import PostModel from '../models/post';
import { ServiceResult } from '../util/generic';
import { Post } from '../modelType/post';

export async function createPost(content: string, isPrivate: Boolean, author: ObjectId):
ServiceResult<'USER_PERM', Post> {
  const newPost = await PostModel.create({
    content,
    author,
    isPrivate,
    isSent: false,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return {
    result: newPost,
    success: true
  };
}

export async function editPost(post: ObjectId, content: string, isPrivate: Boolean, user: ObjectId):
ServiceResult<'POST_NEXIST'|'USER_PERM', Post> {
  const postObj = await PostModel.findById(post);
  if (!postObj) {
    return {reason: 'POST_NEXIST', success: false};
  }
  const hasEditPerm = user.equals(postObj.author as ObjectId);
  if (!hasEditPerm) {
    return {reason: 'USER_PERM', success: false};
  }
  postObj.content = content;
  postObj.isPrivate = isPrivate;
  postObj.updatedAt = new Date();
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

export async function listPosts(perPage: number, page: number = 1, id?: ObjectId):
ServiceResult<undefined, {posts: Post[]}> {
  let query = PostModel.find();
  if (id) {
    query = PostModel.find({author: id});
  } else {
    query = PostModel.find({isPrivate: false});
  }
  if (page > 1) {
    query = query.skip(perPage * (page - 1));
  }
  query = query.sort('-createdAt').populate('author', 'username name');
  const result = await query.limit(perPage);
  return {
    result: {
      posts: result
    },
    success: true
  };
}

export async function getLastUnsentPosts():
ServiceResult<undefined, {posts: Post[]}> {
  let query = PostModel.find({isSent: false});
  query = query.sort('-createdAt').populate('author', 'username name');
  const result = await query;
  return {
    result: {
      posts: result
    },
    success: true
  };
}

export async function updateUnsentPosts(ids: ObjectId[]):
ServiceResult<'POST_NEXIST' | 'NO_IDS'> {
  if (ids.length === 0) {
    return {
      reason: 'NO_IDS',
      success: false
    };
  }
  ids.forEach(async (id: ObjectId) => {
    const post = await PostModel.findById(id);
    if (post === null) {
      return {reason: 'POST_NEXIST', success: false};
    } else {
      post.isSent = true;
      post.save();
    }
  });
  return {
    success: true
  };
}