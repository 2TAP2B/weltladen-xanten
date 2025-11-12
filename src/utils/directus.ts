import { createDirectus, rest, readItems, readSingleton } from '@directus/sdk';

/**
 * Directus Schema Type Definitions
 */
type HeroSlide = {
  id: string;
  status: string;
  sort: number;
  title: string;
  subtitle: string;
  image: string;
  button_text: string;
  button_link: string;
  date_created: string;
  date_updated: string;
};

type OpeningHours = {
  days: string;
  hours: string;
};

type StoreInfo = {
  id: number;
  store_name: string;
  street: string;
  postal_code: string;
  city: string;
  phone: string;
  phone_secondary: string;
  fax: string;
  email: string;
  website: string;
  location_description: string;
  opening_hours: OpeningHours[];
};

type Organization = {
  id: number;
  status: string;
  sort: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  link: string;
};

type Schema = {
  hero_slides: HeroSlide[];
  store_info: StoreInfo;
  organizations: Organization[];
};

/**
 * Directus SDK Client
 */
const directus = createDirectus<Schema>('https://ewgx.steltner.cc').with(rest());

/**
 * Get hero slides for homepage
 * @returns {Promise<Array>} Array of hero slides
 */
export async function getHeroSlides() {
  try {
    const slides = await directus.request(
      readItems('hero_slides', {
        fields: ['id', 'title', 'subtitle', 'image', 'button_text', 'button_link', 'sort'],
        filter: {
          status: { _eq: 'published' }
        },
        sort: ['sort', 'date_created']
      })
    );
    return slides;
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return [];
  }
}

/**
 * Get store information singleton
 * @returns {Promise<StoreInfo | null>} Store information
 */
export async function getStoreInfo() {
  try {
    const storeInfo = await directus.request(
      readSingleton('store_info', {
        fields: ['*']
      })
    );
    return storeInfo;
  } catch (error) {
    console.error('Error fetching store info:', error);
    return null;
  }
}

/**
 * Get organizations for Eine Welt Gruppe Xanten
 * @returns {Promise<Array>} Array of organizations
 */
export async function getOrganizations() {
  try {
    const organizations = await directus.request(
      readItems('organizations', {
        fields: ['id', 'title', 'description', 'icon', 'color', 'link', 'sort'],
        filter: {
          status: { _eq: 'published' }
        },
        sort: ['sort']
      })
    );
    return organizations;
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return [];
  }
}

/**
 * Get Directus asset URL
 * @param fileId - File ID
 * @param options - Transform options (width, height, fit, quality)
 * @returns Full asset URL
 */
export function getAssetUrl(fileId: string, options: {
  width?: number;
  height?: number;
  fit?: string;
  quality?: number;
} = {}) {
  if (!fileId) return '';
  
  const params = new URLSearchParams();
  
  if (options.width) params.append('width', options.width.toString());
  if (options.height) params.append('height', options.height.toString());
  if (options.fit) params.append('fit', options.fit);
  if (options.quality) params.append('quality', options.quality.toString());
  
  const query = params.toString();
  return `https://ewgx.steltner.cc/assets/${fileId}${query ? '?' + query : ''}`;
}

export default directus;
