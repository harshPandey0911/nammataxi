import * as seoService from '../service/seo.service.js';
import { sendSuccess } from '../../../utils/apiResponse.js';

export async function getAllSeo(req, res) {
  const seos = await seoService.getAllSeo();
  return sendSuccess(res, {
    data: seos,
  });
}

export async function createSeo(req, res) {
  const seo = await seoService.createSeo(req.body);
  return sendSuccess(res, {
    message: 'SEO settings created successfully',
    data: seo,
  });
}

export async function updateSeo(req, res) {
  const seo = await seoService.updateSeo(req.params.id, req.body);
  return sendSuccess(res, {
    message: 'SEO settings updated successfully',
    data: seo,
  });
}

export async function deleteSeo(req, res) {
  await seoService.deleteSeo(req.params.id);
  return sendSuccess(res, {
    message: 'SEO settings deleted successfully',
  });
}

export async function getSeoByPage(req, res) {
  const seo = await seoService.getSeoByPage(req.params.page);
  return sendSuccess(res, {
    data: seo,
  });
}
