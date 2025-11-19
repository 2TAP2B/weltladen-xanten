import { createDirectus, rest, readItems, readSingleton, createItem } from '@directus/sdk';

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

type AboutPage = {
  id: number;
  header_title: string;
  header_subtitle: string;
  header_background_image: string;
  mission_title: string;
  mission_text: string;
  vision_title: string;
  vision_text: string;
  mission_image: string;
  history_title: string;
  history_subtitle: string;
};

type CoreValue = {
  id: number;
  status: string;
  sort: number;
  title: string;
  description: string;
  icon: string;
  color: string;
};

type HistoryEvent = {
  id: number;
  status: string;
  sort: number;
  year: string;
  title: string;
  description: string;
};

type Belief = {
  id: number;
  status: string;
  sort: number;
  title: string;
  content: string;
};

type StaffMember = {
  id: number;
  status: string;
  sort: number | null;
  name: string;
  position: string;
  bio: string;
  email: string;
  phone: string;
  photo: string | null;
};

type StaffPageHeader = {
  id: number;
  title: string;
  subtitle: string;
  background_image: string | null;
};

type BlogPost = {
  id: number;
  status: string;
  sort: number | null;
  date_created: string;
  date_updated: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  author: string;
  tags: string[] | null;
  published_date: string;
  reading_time: number | null;
};

type BlogPageHeader = {
  id: number;
  title: string;
  subtitle: string;
  background_image: string | null;
};

type KontaktSubmission = {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  date_created?: string;
  status?: string;
};

type Schema = {
  hero_slides: HeroSlide[];
  store_info: StoreInfo;
  organizations: Organization[];
  about_page: AboutPage;
  core_values: CoreValue[];
  history_timeline: HistoryEvent[];
  beliefs: Belief[];
  staff_members: StaffMember[];
  staff_page_header: StaffPageHeader;
  blog: BlogPost[];
  blog_page_header: BlogPageHeader;
  kontakt: KontaktSubmission[];
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
 * Get about page content singleton
 * @returns {Promise<AboutPage | null>} About page content
 */
export async function getAboutPage() {
  try {
    const aboutPage = await directus.request(
      readSingleton('about_page', {
        fields: ['*']
      })
    );
    return aboutPage;
  } catch (error) {
    console.error('Error fetching about page:', error);
    return null;
  }
}

/**
 * Get core values for about page
 * @returns {Promise<Array>} Array of core values
 */
export async function getCoreValues() {
  try {
    const values = await directus.request(
      readItems('core_values', {
        fields: ['id', 'title', 'description', 'icon', 'color', 'sort'],
        filter: {
          status: { _eq: 'published' }
        },
        sort: ['sort']
      })
    );
    return values;
  } catch (error) {
    console.error('Error fetching core values:', error);
    return [];
  }
}

/**
 * Get history timeline events for about page
 * @returns {Promise<Array>} Array of history events
 */
export async function getHistoryTimeline() {
  try {
    const events = await directus.request(
      readItems('history_timeline', {
        fields: ['id', 'year', 'title', 'description', 'sort'],
        filter: {
          status: { _eq: 'published' }
        },
        sort: ['sort']
      })
    );
    return events;
  } catch (error) {
    console.error('Error fetching history timeline:', error);
    return [];
  }
}

/**
 * Get beliefs for statement of faith
 * @returns {Promise<Array>} Array of beliefs
 */
export async function getBeliefs() {
  try {
    const beliefs = await directus.request(
      readItems('beliefs', {
        fields: ['id', 'title', 'content', 'sort'],
        filter: {
          status: { _eq: 'published' }
        },
        sort: ['sort']
      })
    );
    return beliefs;
  } catch (error) {
    console.error('Error fetching beliefs:', error);
    return [];
  }
}

/**
 * Get staff members (Mitarbeiter)
 * @returns {Promise<Array>} Array of staff members
 */
export async function getStaffMembers() {
  try {
    const staff = await directus.request(
      readItems('staff_members', {
        fields: [
          'id', 
          'name', 
          'position', 
          'bio', 
          'email', 
          'phone', 
          'photo', 
          'status',
          'sort'
        ],
        filter: {
          status: { _eq: 'published' }
        },
        sort: ['sort', 'name']
      })
    );
    return staff;
  } catch (error) {
    console.error('Error fetching staff members:', error);
    return [];
  }
}

/**
 * Get staff page header content
 * @returns {Promise<StaffPageHeader | null>} Staff page header content
 */
export async function getStaffPageHeader() {
  try {
    const header = await directus.request(
      readSingleton('staff_page_header', {
        fields: ['title', 'subtitle', 'background_image']
      })
    );
    return header;
  } catch (error) {
    console.error('Error fetching staff page header:', error);
    return null;
  }
}

/**
 * Get all blog posts
 * @returns {Promise<Array>} Array of blog posts
 */
export async function getBlogPosts() {
  try {
    const posts = await directus.request(
      readItems('blog', {
        fields: [
          'id',
          'title',
          'slug',
          'excerpt',
          'content',
          'featured_image',
          'author',
          'tags',
          'published_date',
          'reading_time',
          'status',
          'sort'
        ],
        filter: {
          status: { _eq: 'published' }
        },
        sort: ['-published_date', '-date_created']
      })
    );
    return posts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

/**
 * Get a single blog post by slug
 * @param slug - Blog post slug
 * @returns {Promise<BlogPost | null>} Blog post
 */
export async function getBlogPostBySlug(slug: string) {
  try {
    const posts = await directus.request(
      readItems('blog', {
        fields: [
          'id',
          'title',
          'slug',
          'excerpt',
          'content',
          'featured_image',
          'author',
          'tags',
          'published_date',
          'reading_time',
          'date_created',
          'date_updated'
        ],
        filter: {
          slug: { _eq: slug },
          status: { _eq: 'published' }
        },
        limit: 1
      })
    );
    return posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

/**
 * Get blog page header content
 * @returns {Promise<BlogPageHeader | null>} Blog page header content
 */
export async function getBlogPageHeader() {
  try {
    const header = await directus.request(
      readSingleton('blog_page_header', {
        fields: ['title', 'subtitle', 'background_image']
      })
    );
    return header;
  } catch (error) {
    console.error('Error fetching blog page header:', error);
    return null;
  }
}

/**
 * Submit a contact form
 * @param data - Contact form data
 * @returns {Promise<KontaktSubmission | null>} Created contact submission
 * Note: This uses public access - ensure the kontakt collection allows public create permission
 */
export async function submitKontaktForm(data: Omit<KontaktSubmission, 'id' | 'date_created' | 'status'>) {
  try {
    // Use the public directus client (no authentication needed)
    const submission = await directus.request(
      createItem('kontakt', {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        status: 'new'
      })
    );
    return submission;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
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
