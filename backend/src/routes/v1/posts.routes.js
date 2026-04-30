import { Router } from 'express';
import * as postController from '../../modules/posts/controller/post.controller.js';
import { protect, authorize } from '../../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', postController.getAllPosts);
router.get('/:slug', postController.getPost);

// Admin only routes
router.post('/', protect, authorize('admin'), postController.createPost);
router.patch('/:id', protect, authorize('admin'), postController.updatePost);
router.delete('/:id', protect, authorize('admin'), postController.deletePost);

export default router;
