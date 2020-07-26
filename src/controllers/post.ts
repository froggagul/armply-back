import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'bson';
import * as PostService from '../services/post';
import { UserDoc } from '../models/user';

export async function writePost(req: Request, res: Response, next: NextFunction) {
  try {
    const {content, isPrivate} = req.body;
    const ret = await PostService.createPost(content, isPrivate, (req.user as UserDoc)!._id);
    if (ret.success) {
      res.status(200).json({...ret});
      return;
    }
    if (ret.reason === 'USER_PERM') {
      res.status(403).json({reason: ret.reason});
    }
  } catch (err) {
    next(err);
  }
}

export async function updatePost(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { content, isPrivate } = req.body;
    const result = await PostService.editPost(new ObjectId(id), content, isPrivate, (req.user as UserDoc)!._id);
    if (result.success) {
      return res.json({result});
    }
    if (result.reason === 'POST_NEXIST') {
      return res.status(404).json({reason: result.reason});
    }
    if (result.reason === 'USER_PERM') {
      return res.status(403).json({reason: result.reason});
    }
  } catch (err) {
    next(err);
  }
}

export async function removePost(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const ret = await PostService.removePost(new ObjectId(id), (req.user as UserDoc)!._id);
    if (ret.success) {
      return res.json({});
    }
    if (ret.reason === 'POST_NEXIST') {
      return res.status(404).json({reason: ret.reason});
    }
    if (ret.reason === 'USER_NEXIST') {
      return res.status(401).json({reason: ret.reason});
    }
    if (ret.reason === 'USER_PERM') {
      return res.status(403).json({reason: ret.reason});
    }
  } catch (err) {
    next(err);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    // perpage, page, id
    const {perPage, page} = req.query;
    const ret = await PostService.listPosts(parseInt(perPage as string), parseInt(page as string), undefined);
    if (ret.success) {
      return res.status(200).json({
        posts: ret.result!.posts.map(x => ({
          createdAt: x.createdAt,
          user: x.author,
          content: x.content,
          isPrivate: x.isPrivate,
          isSent: x.isSent,
        }))
      });
    }
    res.status(400).json({
      reason: ret.reason
    });
  } catch (err) {
    next(err);
  }
}

export async function my(req: Request, res: Response, next: NextFunction) {
  try {
    // perpage, page, id
    const {perPage, page} = req.query;
    const ret = await PostService.listPosts(parseInt(perPage as string), parseInt(page as string), (req.user as UserDoc)!._id);
    if (ret.success) {
      return res.status(200).json({
        posts: ret.result!.posts.map(x => ({
          createdAt: x.createdAt,
          user: x.author,
          content: x.content,
          isPrivate: x.isPrivate,
          isSent: x.isSent,
        }))
      });
    }
    res.status(400).json({
      reason: ret.reason
    });
  } catch (err) {
    next(err);
  }
}
