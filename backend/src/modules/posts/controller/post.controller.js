import * as postService from '../service/post.service.js';
import { sendSuccess } from '../../../utils/apiResponse.js';

export async function getAllPosts(req, res) {
  const filters = {};
  if (req.query.category) filters.category = req.query.category;
  if (req.query.isActive) filters.isActive = req.query.isActive === 'true';

  const posts = await postService.getAllPosts(filters);
  return sendSuccess(res, {
    data: posts,
  });
}

export async function getPost(req, res) {
  const post = await postService.getPostBySlug(req.params.slug);
  return sendSuccess(res, {
    data: post,
  });
}

export async function createPost(req, res) {
  const post = await postService.createPost(req.body);
  return sendSuccess(res, {
    message: 'Post created successfully',
    data: post,
  });
}

export async function updatePost(req, res) {
  const post = await postService.updatePost(req.params.id, req.body);
  return sendSuccess(res, {
    message: 'Post updated successfully',
    data: post,
  });
}

export async function deletePost(req, res) {
  await postService.deletePost(req.params.id);
  return sendSuccess(res, {
    message: 'Post deleted successfully',
  });
}
