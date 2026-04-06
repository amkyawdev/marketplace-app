# C2C Marketplace Application Specification

## Project Overview
- **Project Name**: Myanmar C2C Marketplace
- **Type**: Consumer-to-Consumer Marketplace Web Application
- **Core Functionality**: A peer-to-peer marketplace with identity verification via Myanmar NRC, GPS-based location, and escrow-style payment processing
- **Target Users**: Myanmar consumers buying/selling items with KPay and Wave payment integration

## Technology Stack
- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS with Glassmorphism
- **Animations**: Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Payment**: KPay/Wave (30% down payment escrow)

## Database Schema

### 1. Profiles Table
```sql
-- profiles: Extended user information with NRC verification
id: uuid (PK, FK to auth.users)
full_name: text
nrc_number: text (unique)
nrc_photo_url: text (array of 2)
is_verified: boolean (default false)
gps_location: geography (Point)
kpay_no: text
wave_no: text
created_at: timestamptz
updated_at: timestamptz
```

### 2. Products Table
```sql
-- products: Items for sale
id: uuid (PK)
seller_id: uuid (FK to profiles.id)
title: text
description: text
price: decimal
images: text (array)
status: enum ('open', 'pending', 'sold')
category: text
created_at: timestamptz
updated_at: timestamptz
```

### 3. Orders Table
```sql
-- orders: Purchase transactions
id: uuid (PK)
product_id: uuid (FK to products.id)
buyer_id: uuid (FK to profiles.id)
seller_id: uuid (FK to profiles.id)
payment_screenshot: text
last_4_digits: text
amount: decimal
down_payment_amount: decimal (30%)
status: enum ('pending', 'confirmed')
created_at: timestamptz
updated_at: timestamptz
```

## Core Features

### 1. Identity Verification (NRC)
- 4-part NRC selector: [Region 1-14] / [Township] [Type: (N), (A), (P)] [6-digit Serial]
- Camera integration for NRC front/back photos
- Live face scan verification
- GPS location capture via Geolocation API

### 2. Seller Workflow
- Product photo upload from camera
- Toggle product status (In-Stock / Out-of-Stock)
- Automatic status change to 'Sold' on payment confirmation

### 3. Payment (Escrow 30%)
- Buyer confirms purchase
- System calculates 30% down payment
- Display seller's KPay/Wave info
- Buyer uploads screenshot + last 4 digits
- Seller confirms → product status changes to 'Sold'

### 4. Dashboard
- Public: Glassmorphism card layout with product listings
- User Dashboard: Tabs for "My Orders" (buyer) and "Inventory" (seller)

## UI/UX Specification

### Color Palette
- **Primary**: #6366f1 (Indigo)
- **Secondary**: #8b5cf6 (Violet)
- **Accent**: #f472b6 (Pink)
- **Background**: #0f172a (Dark slate)
- **Surface**: rgba(30, 41, 59, 0.8) (Glassmorphism)
- **Text Primary**: #f8fafc
- **Text Secondary**: #94a3b8
- **Success**: #22c55e
- **Warning**: #f59e0b
- **Error**: #ef4444

### Typography
- **Headings**: "Outfit", sans-serif (Google Fonts)
- **Body**: "DM Sans", sans-serif (Google Fonts)
- **Monospace**: "JetBrains Mono" (for NRC format)

### Glassmorphism Effects
- Background: rgba(255, 255, 255, 0.05)
- Border: 1px solid rgba(255, 255, 255, 0.1)
- Backdrop blur: 20px
- Border radius: 24px

### Animations
- Product card entrance: fadeInUp with stagger
- Page transitions: slide + fade
- Button hover: scale(1.02) + glow effect
- Loading states: pulse animation

## Security Rules (Supabase RLS)

### Profiles
- Users can read all profiles (for verification display)
- Users can only update their own profile
- Only is_verified = true can create products

### Products
- Everyone can read products (public marketplace)
- Only seller can update their own products
- Only verified users can create products

### Orders
- Only buyer and seller can view their own orders
- Only buyer can create orders
- Only seller can confirm orders

## File Structure
```
/supabase
  /migrations/
    001_initial_schema.sql
  /seed.sql

/src
  /app
    /layout.tsx
    /page.tsx
    /auth/
      /signup/page.tsx
      /login/page.tsx
    /dashboard/
      /page.tsx
      /orders/page.tsx
      /inventory/page.tsx
    /products/
      /page.tsx
      /[id]/page.tsx
      /create/page.tsx
    /api/
      /auth/
      /verify/

  /components
    /ui/
      Button.tsx
      Card.tsx
      Input.tsx
      Modal.tsx
    /auth/
      NRCSelector.tsx
      FaceScanner.tsx
      NRCUploader.tsx
    /market/
      ProductCard.tsx
      ProductGrid.tsx
    /payment/
      PaymentForm.tsx
      PaymentConfirmation.tsx

  /lib
    supabase.ts
    server-utils.ts
    nrc-constants.ts

  /hooks
    useUser.ts
    useOrders.ts
    useProducts.ts

  /types
    index.ts

  /utils
    formatters.ts

  middleware.ts
  tailwind.config.ts
  tailwind.config.ts
  postcss.config.mjs
  next.config.mjs
  package.json
```

## Acceptance Criteria

### Authentication
- [ ] User can sign up with email/password
- [ ] User completes NRC verification
- [ ] GPS location is captured on signup
- [ ] NRC photos are uploaded to Supabase Storage
- [ ] User is marked as verified after approval

### Products
- [ ] Verified users can create product listings
- [ ] Products display in grid with glassmorphism cards
- [ ] Product details page shows all information
- [ ] Seller can toggle product status

### Orders
- [ ] Buyer can initiate purchase (30% down payment)
- [ ] Payment form shows KPay/Wave details
- [ ] Screenshot upload works
- [ ] Seller receives notification
- [ ] Seller can confirm → product marked as sold

### UI/UX
- [ ] Glassmorphism styling applied consistently
- [ ] Framer Motion animations on product cards
- [ ] Responsive design works on mobile
- [ ] Dark theme with vibrant accents

### Security
- [ ] RLS policies enforced
- [ ] Only verified users can sell
- [ ] Users can only access their own data