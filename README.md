# SignalShop - Competitor Signals Test Store

A fake e-commerce website built to test conversion signal integrations (Pixel + CAPI) for major ad platforms.

## What's Included

### E-Commerce Pages
- **Home** (`/`) - Product catalog with 8 items
- **Product Detail** (`/product/[id]`) - Individual product page
- **Cart** (`/cart`) - Shopping cart with quantity controls
- **Checkout** (`/checkout`) - Checkout form (name, email, address, fake payment)
- **Thank You** (`/thank-you`) - Purchase confirmation

### Conversion Events Fired
| Page | Event | When |
|------|-------|------|
| All pages | `PageView` | On page load |
| Product Detail | `ViewContent` | On page load |
| Product Card / Detail | `AddToCart` | On "Add to Cart" click |
| Checkout | `InitiateCheckout` | On page load |
| Checkout | `Purchase` | On form submit |

### Platform Integrations

Each platform has both **client-side pixel** (JavaScript) and **server-side CAPI** (API route):

| Platform | Pixel | CAPI | Status |
|----------|-------|------|--------|
| Meta (Facebook) | `fbq()` | Conversions API | Installed |
| TikTok | `ttq` | Events API | Coming soon |
| Snapchat | `snaptr` | Conversions API | Coming soon |
| Pinterest | `pintrk` | Conversions API | Coming soon |
| Reddit | `rdt` | Conversions API | Coming soon |

---

## Running Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

---

## Deploying to Render.com

### Step 1: Create a Render Account
1. Go to https://render.com and click **"Get Started"**
2. Sign up with your **GitHub account** (this connects them automatically)

### Step 2: Create a New Web Service
1. In the Render dashboard, click **"New +"** then **"Web Service"**
2. Select **"Build and deploy from a Git repository"**
3. Find and select the **`competitor-signals-shop`** repository
4. Render will auto-detect the settings from `render.yaml`, but verify:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Click **"Deploy Web Service"**

### Step 3: Wait for Deploy
- The first build takes 2-3 minutes
- Once done, you'll get a URL like: `https://competitor-signals-shop.onrender.com`

### Step 4: Add Pixel IDs (When Ready)
1. In Render, go to your service → **"Environment"** tab
2. Add your pixel IDs and API tokens as key-value pairs:

| Key | What It Is |
|-----|-----------|
| `NEXT_PUBLIC_META_PIXEL_ID` | Your Meta/Facebook Pixel ID (e.g. `123456789`) |
| `META_ACCESS_TOKEN` | Meta Conversions API access token |
| `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | Your TikTok Pixel ID |
| `TIKTOK_ACCESS_TOKEN` | TikTok Events API access token |
| `NEXT_PUBLIC_SNAP_PIXEL_ID` | Your Snapchat Pixel ID |
| `SNAP_ACCESS_TOKEN` | Snapchat CAPI access token |
| `NEXT_PUBLIC_PINTEREST_TAG_ID` | Your Pinterest Tag ID |
| `PINTEREST_AD_ACCOUNT_ID` | Pinterest Ad Account ID |
| `PINTEREST_ACCESS_TOKEN` | Pinterest CAPI access token |
| `NEXT_PUBLIC_REDDIT_PIXEL_ID` | Your Reddit Pixel ID |
| `REDDIT_AD_ACCOUNT_ID` | Reddit Ad Account ID |
| `REDDIT_ACCESS_TOKEN` | Reddit CAPI access token |

3. Click **"Save Changes"** -- Render will automatically redeploy

> **Note**: The site works fine without any pixel IDs. Tracking calls silently skip when IDs are missing. Add them whenever you're ready.

---

## How It Works

```
Browser (User visits page)
  │
  ├── Client-side Pixels fire (fbq, ttq, snaptr, etc.)
  │     → Sends event directly to ad platform
  │
  └── fetch("/api/capi") sends event to our server
        │
        └── Server fans out to all platform CAPI endpoints
              → Meta Conversions API
              → TikTok Events API
              → Snapchat Conversions API
              → Pinterest Conversions API
              → Reddit Conversions API
```

Both client and server send the same `event_id`, so ad platforms can deduplicate and count it only once.

---

## Tech Stack

- **Next.js 16** (App Router)
- **Tailwind CSS v4**
- **TypeScript**
- Deployed on **Render.com**
