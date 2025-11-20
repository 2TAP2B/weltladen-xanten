# Performance Optimization Guide

## Summary of Improvements

### ✅ Completed Optimizations

#### 1. **Font Loading Optimization** (Saves ~1,620ms render blocking)

**Changes Made:**
- Moved Google Fonts from CSS `@import` to HTML `<link>` with deferred loading
- Added `preconnect` hints to establish early connections
- Used `media="print" onload="this.media='all'"` trick to defer font loading
- Added `font-display: swap` to ensure text is visible immediately

**Impact:**
- Eliminates render-blocking fonts
- Text appears immediately with fallback fonts
- Fonts load asynchronously without blocking page render
- Reduces First Contentful Paint (FCP) time

#### 2. **Image Optimization Script Created**

**Tool:** `optimize-images.sh`

**Usage:**
```bash
# Optimize hero images
./optimize-images.sh --hero public/uploads/hero-image.jpg

# Optimize event/card images
./optimize-images.sh --card -r public/uploads/events/

# Optimize all images in directory
./optimize-images.sh -r public/uploads/
```

**Impact:**
- Converts to WebP (saves ~50-70% file size)
- Properly resizes images
- Can save ~704 KiB as reported by PageSpeed

---

## Additional Recommended Optimizations

### 3. **Optimize Directus Image Delivery**

Since images are served from Directus (`ewgx.steltner.cc`), we're already using query parameters for optimization. However, we can improve further:

**Current Implementation:**
```typescript
getAssetUrl(image, { width: 800, height: 600, fit: 'cover', quality: 80 })
```

**Recommended Changes:**

1. **Add WebP format parameter:**
```typescript
// In src/utils/directus.ts - update getAssetUrl function
export function getAssetUrl(
  assetId: string, 
  options: { 
    width?: number; 
    height?: number; 
    fit?: 'cover' | 'contain' | 'inside' | 'outside'; 
    quality?: number;
    format?: 'webp' | 'jpg' | 'png';
  } = {}
) {
  const { width, height, fit = 'cover', quality = 85, format = 'webp' } = options;
  
  const params = new URLSearchParams();
  if (width) params.append('width', width.toString());
  if (height) params.append('height', height.toString());
  if (fit) params.append('fit', fit);
  if (quality) params.append('quality', quality.toString());
  if (format) params.append('format', format);
  
  return `${DIRECTUS_URL}/assets/${assetId}?${params.toString()}`;
}
```

2. **Use responsive images in components:**
```astro
<!-- Instead of single src, use srcset for responsive images -->
<img
  src={getAssetUrl(image, { width: 800, format: 'webp', quality: 85 })}
  srcset={`
    ${getAssetUrl(image, { width: 400, format: 'webp', quality: 85 })} 400w,
    ${getAssetUrl(image, { width: 800, format: 'webp', quality: 85 })} 800w,
    ${getAssetUrl(image, { width: 1200, format: 'webp', quality: 85 })} 1200w
  `}
  sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
  alt={alt}
  loading="lazy"
/>
```

### 4. **Add Critical CSS Inlining**

For the CSS file that's render-blocking (`/_astro/_slug_.CXE-NCLP.css` - 11KB):

**Option A: Inline Critical CSS (Automatic with Astro)**
Astro already does this partially, but you can ensure it's optimized:

```javascript
// In astro.config.mjs
export default defineConfig({
  vite: {
    build: {
      cssCodeSplit: true, // Split CSS per page
      minify: 'esbuild',
    },
  },
});
```

**Option B: Manual Critical CSS**
1. Install critical CSS tool:
```bash
npm install --save-dev vite-plugin-critical
```

2. Update `astro.config.mjs`:
```javascript
import { defineConfig } from 'astro/config';
import critical from 'vite-plugin-critical';

export default defineConfig({
  vite: {
    plugins: [
      critical({
        inline: true,
        minify: true,
      }),
    ],
  },
});
```

### 5. **Optimize Static Assets**

**a. Add `loading="lazy"` to all images:**
```astro
<!-- Make sure all images use lazy loading -->
<img src="..." alt="..." loading="lazy" />
```

**b. Preload critical images:**
```astro
<!-- In BaseLayout.astro head -->
<link rel="preload" as="image" href="/eine-welt-gruppe2.webp" />
```

### 6. **Enable HTTP/2 Server Push (Already Enabled on Vercel)**

Vercel automatically uses HTTP/2, but ensure your Directus server does too.

### 7. **Add Resource Hints for Directus**

```astro
<!-- In BaseLayout.astro head -->
<link rel="preconnect" href="https://ewgx.steltner.cc" />
<link rel="dns-prefetch" href="https://ewgx.steltner.cc" />
```

### 8. **Optimize Hero Images Specifically**

Since the hero image is the largest (749.9 KiB → should be ~337.5 KiB):

```typescript
// Use lower quality for hero backgrounds
getAssetUrl(heroImage, { 
  width: 1920, 
  height: 800, 
  format: 'webp', 
  quality: 75  // Lower quality for backgrounds is acceptable
})
```

---

## Implementation Priority

### 🔴 **Critical (Do Now)**
1. ✅ Font loading optimization (DONE)
2. Add `format: 'webp'` parameter to all Directus image calls
3. Add preconnect to Directus server
4. Optimize hero images with lower quality setting

### 🟡 **Important (Do Soon)**
1. Add `srcset` for responsive images
2. Optimize eine-welt-gruppe2.webp (158.9 KiB → ~27.6 KiB)
3. Add `loading="lazy"` to all images

### 🟢 **Nice to Have (Do Later)**
1. Implement critical CSS inlining
2. Add service worker for offline support
3. Implement image CDN

---

## Quick Wins You Can Do Now

```bash
# 1. Optimize the local eine-welt-gruppe2.webp file
./optimize-images.sh --hero public/eine-welt-gruppe2.webp

# 2. Check if file is actually being used
# Replace with optimized version

# 3. Test the changes
npm run build
npm run preview
```

---

## Expected Results After All Optimizations

- **LCP (Largest Contentful Paint):** < 2.5s (currently ~3-4s)
- **FCP (First Contentful Paint):** < 1.8s (currently ~2.5s)
- **TTI (Time to Interactive):** < 3.8s
- **Total Blocking Time:** < 200ms
- **PageSpeed Score:** 90+ (mobile), 95+ (desktop)

---

## Testing

```bash
# Build and test locally
npm run build
npm run preview

# Test with Lighthouse
npx lighthouse http://localhost:4321 --view

# Test specific page
npx lighthouse http://localhost:4321/events --view
```

---

## Monitoring

After deployment, monitor with:
- Google PageSpeed Insights
- Chrome DevTools Lighthouse
- WebPageTest.org
- Vercel Analytics (already integrated)
