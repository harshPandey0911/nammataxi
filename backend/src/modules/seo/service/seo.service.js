import SEO from '../model/seo.model.js';
import { AppError } from '../../../utils/AppError.js';

export async function getAllSeo() {
  return SEO.find().sort({ page: 1 });
}

export async function createSeo(data) {
  const existing = await SEO.findOne({ page: data.page });
  if (existing) {
    throw AppError.badRequest('SEO settings for this page already exist');
  }
  return SEO.create(data);
}

export async function updateSeo(id, data) {
  const seo = await SEO.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!seo) {
    throw AppError.notFound('SEO settings not found');
  }
  return seo;
}

export async function deleteSeo(id) {
  const seo = await SEO.findByIdAndDelete(id);
  if (!seo) {
    throw AppError.notFound('SEO settings not found');
  }
  return seo;
}

export async function getSeoByPage(pageName) {
  return SEO.findOne({ page: pageName });
}
