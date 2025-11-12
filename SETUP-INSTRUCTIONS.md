# Hero Slideshow Setup Instructions

## ✅ What We've Completed

1. **Created Directus Collection**: `hero_slides` collection with all necessary fields
2. **Installed Directus SDK**: `@directus/sdk` package installed
3. **Created Directus Helper**: `/src/utils/directus.ts` with typed SDK client
4. **Updated HeroSection Component**: Now supports dynamic slideshow with:
   - Auto-play (5 second intervals)
   - Previous/Next navigation buttons
   - Slide indicators
   - Smooth fade transitions
   - Pause on hover
5. **Updated Homepage**: Now fetches and displays slides from Directus

## 🔧 Required Manual Step: Enable Public Access

**You must do this in your Directus Admin Panel:**

1. Go to `https://ewgx.steltner.cc/admin`
2. Navigate to **Settings → Access Policies → Public**
3. Scroll down to **Permissions** section
4. Find **hero_slides** in the collections list
5. Check the **Read** checkbox (👁️ icon)
6. Click **Save**

Without this step, the public API cannot fetch the slides!

## 📝 How to Add Slides in Directus

1. Go to your Directus admin: `https://ewgx.steltner.cc/admin`
2. Navigate to **Content → Hero Slides**
3. Click **Create Item** (+)
4. Fill in the fields:
   - **Title**: Main headline (required)
   - **Subtitle**: Subheading text (optional)
   - **Image**: Upload hero background image (required, recommended: 1920x600px)
   - **Button Text**: Call-to-action text (e.g., "Learn More")
   - **Button Link**: URL for the button (e.g., `/about-us`)
   - **Status**: Set to **Published** when ready
5. Click **Save**
6. Create multiple slides for the slideshow effect

## 🎨 Slideshow Features

- **Auto-play**: Slides change every 5 seconds automatically
- **Navigation**: Previous/Next arrow buttons
- **Indicators**: Dots at the bottom show slide position
- **Pause on Hover**: Slideshow pauses when you hover over it
- **Smooth Transitions**: Fade effect between slides
- **Responsive**: Works on all screen sizes
- **Fallback**: Shows default content if no slides are published

## 🧪 Testing

After enabling public access and adding slides:

```bash
npm run dev
```

Visit `http://localhost:4321/` to see your slideshow in action!

## 🚀 Deployment

When ready to deploy:

```bash
npm run build
```

The slideshow data will be fetched at build time and baked into the static pages.

## 📚 Directus Asset URLs

Images are automatically optimized using Directus transforms:
- Width: 1920px
- Quality: 80%
- Format: Auto-detected (WebP for modern browsers)

## 🔗 Collection URL

Access your hero_slides collection:
`https://ewgx.steltner.cc/admin/content/hero_slides`
