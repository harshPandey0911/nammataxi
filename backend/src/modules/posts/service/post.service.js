import Post from '../model/post.model.js';
import { AppError } from '../../../utils/AppError.js';

export async function getAllPosts(filters = {}) {
  return Post.find(filters).sort({ createdAt: -1 });
}

export async function getPostBySlug(slug) {
  const post = await Post.findOne({ slug, isActive: true });
  if (!post) {
    throw AppError.notFound('Post not found');
  }
  return post;
}

export async function createPost(data) {
  return Post.create(data);
}

export async function updatePost(id, data) {
  const post = await Post.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!post) {
    throw AppError.notFound('Post not found');
  }
  return post;
}

export async function deletePost(id) {
  const post = await Post.findByIdAndDelete(id);
  if (!post) {
    throw AppError.notFound('Post not found');
  }
  return post;
}
