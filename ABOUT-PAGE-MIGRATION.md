# About Page Migration to Directus

## Summary
Successfully migrated the about page to use Directus CMS and renamed it to German slug `ueber-uns`.

## Changes Made

### 1. File Renamed
- `/src/pages/about-us.astro` → `/src/pages/ueber-uns.astro`

### 2. Links Updated
All internal links updated from `/about-us` to `/ueber-uns`:
- `/src/pages/index.astro` - Learn More button
- `/src/components/Global/Navigation.astro` - Navigation menu (changed to "Über uns")
- `/src/components/Global/Footer.astro` - Footer links (changed to "Über uns")
- `/src/pages/staff.astro` - Back to About button

### 3. Directus Collections Created

#### `about_page` (Singleton)
Fields:
- `header_title` (string) - Page header title
- `header_subtitle` (string) - Page header subtitle
- `header_background_image` (file) - Page header background image
- `mission_title` (string) - Mission section title
- `mission_text` (rich text) - Mission description
- `vision_title` (string) - Vision section title  
- `vision_text` (rich text) - Vision description
- `mission_image` (file) - Hero image for mission/vision section
- `history_title` (string) - History section title
- `history_subtitle` (string) - History section subtitle

#### `core_values` (Collection)
Fields:
- `status` (dropdown: published/draft)
- `sort` (integer, hidden) - Sort order
- `title` (string, required) - Value title
- `description` (textarea) - Value description
- `icon` (string) - Material Design icon name
- `color` (color picker) - Icon background color

#### `history_timeline` (Collection)
Fields:
- `status` (dropdown: published/draft)
- `sort` (integer, hidden) - Sort order
- `year` (string, required) - Timeline year/period
- `title` (string, required) - Event title
- `description` (textarea) - Event description

#### `beliefs` (Collection)
Fields:
- `status` (dropdown: published/draft)
- `sort` (integer, hidden) - Sort order
- `title` (string, required) - Belief topic title
- `content` (rich text) - Belief description/explanation

### 4. Directus Helper Updated (`/src/utils/directus.ts`)

Added types:
- `AboutPage`
- `CoreValue`
- `HistoryEvent`
- `Belief`

Added functions:
- `getAboutPage()` - Fetch about page singleton
- `getCoreValues()` - Fetch published core values
- `getHistoryTimeline()` - Fetch published timeline events
- `getBeliefs()` - Fetch published beliefs

### 5. Page Updated (`/src/pages/ueber-uns.astro`)

Changes:
- Added Directus data fetching in frontmatter
- Updated Mission & Vision section to use `about_page` singleton data
- Updated Core Values section to dynamically render from `core_values` collection
- Updated History Timeline section to dynamically render from `history_timeline` collection
- Updated Beliefs section to dynamically render from `beliefs` collection
- Added full dark mode support to all sections
- Translated section titles to German:
  - "Unsere Grundwerte" (Our Core Values)
  - "Unsere Geschichte" (Our History)
  - "Unser Team" (Our Team)
  - "Woran wir glauben" (What We Believe)

## Next Steps

### 1. Enable Public Read Permissions
In Directus Admin (https://ewgx.steltner.cc/admin):
1. Go to Settings → Access Policies → Public
2. Enable **Read** permission for:
   - `about_page`
   - `core_values`
   - `history_timeline`
   - `beliefs`

### 2. Add Content in Directus
Add your content for each collection:

**About Page:**
1. Go to Content → About Page
2. Fill in mission/vision titles and texts
3. Upload mission image
4. Add history section titles

**Core Values:**
1. Go to Content → Core Values
2. Add entries (suggested values from original page):
   - Biblical Teaching (icon: book, color: blue)
   - Authentic Community (icon: favorite, color: purple)
   - Missional Living (icon: public, color: orange)
   - Spiritual Growth (icon: schedule, color: green)
   - Spirit-Led Worship (icon: auto_fix_high, color: purple)
   - Servant Leadership (icon: extension, color: yellow)

**History Timeline:**
1. Go to Content → History Timeline
2. Add events chronologically

**Beliefs:**
1. Go to Content → Beliefs
2. Add belief statements with rich text descriptions

### 3. Material Icons
For core values icons, use Material Design icon names from:
https://fonts.google.com/icons

Add to `<head>` in BaseLayout.astro if not already present:
```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

### 4. Test
1. Build the site: `npm run build`
2. Check for any errors
3. Verify all content displays correctly
4. Test dark mode toggle

## Fallback Content
The page includes fallback messages when collections are empty:
- "No core values found. Please add them in Directus."
- "No history events found. Please add them in Directus."
- "No beliefs found. Please add them in Directus."

Static fallback content is used for mission/vision if singleton is empty.
