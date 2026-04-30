import { Router } from 'express';
import * as seoController from '../../modules/seo/controller/seo.controller.js';
import { protect, authorize } from '../../middleware/auth.js';

const router = Router();

// Public route for user-side to get SEO by page
router.get('/page/:page', seoController.getSeoByPage);

// Only admins can manage SEO settings
router.use(protect, authorize('admin'));

router.get('/', seoController.getAllSeo);
router.post('/', seoController.createSeo);
router.patch('/:id', seoController.updateSeo);
router.delete('/:id', seoController.deleteSeo);

export default router;
