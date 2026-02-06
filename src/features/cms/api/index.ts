/**
 * CMS API - Main Export
 * Re-exports all CMS API modules
 */

// Export individual APIs
export { contentApi } from "./contentApi";
export { categoryApi } from "./categoryApi";
export { tagApi } from "./tagApi";
export { statsApi } from "./statsApi";
export { mediaApi } from "./mediaApi";

// Export helpers
export { buildQueryString, type IPaginatedResponse } from "./helpers";

// Import for combined export
import { categoryApi } from "./categoryApi";
import { contentApi } from "./contentApi";
import { mediaApi } from "./mediaApi";
import { statsApi } from "./statsApi";
import { tagApi } from "./tagApi";

// Combined CMS API object for backward compatibility
export const cmsApi = {
  content: contentApi,
  categories: categoryApi,
  tags: tagApi,
  stats: statsApi,
  media: mediaApi,
};

export default cmsApi;
