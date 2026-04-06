# 🏪 Myanmar C2C Marketplace

A high-security Consumer-to-Consumer (C2C) Marketplace Web Application built with Next.js 14 (App Router) and Supabase (Auth, Database, Storage).

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-3.0-green?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-cyan?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🔐 Identity Verification
- **4-Part NRC Selector**: Myanmar NRC format `[Region 1-14] / [Township] [Type: (N), (A), (P)] [6-digit Serial]`
- **NRC Photo Capture**: Camera integration for NRC Front/Back photos
- **Live Face Scan**: Real-time face recognition for identity verification
- **GPS Location**: Geolocation API to capture user's real-time coordinates

### 🛒 Seller Workflow
- Product photo upload directly from camera
- Toggle product status (In-Stock / Out-of-Stock)
- Inventory management dashboard

### 💳 Escrow-Style Payment (30% Down Payment)
- Buyer confirms purchase → System calculates 30% down payment
- Displays Seller's KPay/Wave payment information
- Buyer uploads payment screenshot + last 4 digits of Transaction ID
- Seller confirms payment → Product status automatically changes to 'Sold'

### 🎨 UI/UX
- **Glassmorphism Design**: Modern card layout with translucent effects
- **Framer Motion**: Smooth animations and transitions
- **Dark Theme**: Sleek dark mode with vibrant gradient accents
- **Responsive**: Works on all screen sizes

## 📁 Project Structure

```
marketplace-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── auth/
│   │   │   ├── login/          # Login page
│   │   │   └── signup/         # Signup with NRC verification
│   │   ├── dashboard/          # User dashboard (orders & inventory)
│   │   ├── products/           # Product listing & details
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing page
│   │   └── providers.tsx       # React providers
│   │
│   ├── components/
│   │   ├── auth/               # NRCSelector, Camera, FaceScanner
│   │   ├── market/             # ProductCard, ProductGrid
│   │   ├── payment/            # PaymentForm
│   │   └── ui/                 # Button, Card, Input, Modal, Navigation
│   │
│   ├── lib/
│   │   ├── supabase.ts         # Browser client
│   │   ├── server-utils.ts     # Server client
│   │   ├── database.types.ts   # TypeScript types
│   │   └── nrc-constants.ts    # Myanmar NRC data
│   │
│   ├── hooks/
│   │   └── useUser.ts          # User authentication hook
│   │
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   │
│   └── utils/
│       └── formatters.ts       # Currency, date formatters
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Database schema
│
├── middleware.ts                # Route protection
├── tailwind.config.js          # Tailwind configuration
├── next.config.mjs             # Next.js configuration
└── package.json                # Dependencies
```

## 🗄️ Database Schema

### Profiles Table
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | User ID (FK to auth.users) |
| full_name | text | User's full name |
| nrc_number | text | Unique NRC number |
| nrc_photo_url | text | URL to NRC photo |
| is_verified | boolean | Verification status |
| gps_location | geography | GPS coordinates |
| kpay_no | text | KPay number |
| wave_no | text | Wave number |

### Products Table
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Product ID |
| seller_id | uuid | FK to profiles.id |
| title | text | Product title |
| price | number | Product price (MMK) |
| images | text[] | Array of image URLs |
| status | enum | open, pending, sold |

### Orders Table
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Order ID |
| product_id | uuid | FK to products.id |
| buyer_id | uuid | FK to profiles.id |
| seller_id | uuid | FK to profiles.id |
| payment_screenshot | text | Payment screenshot URL |
| last_4_digits | text | Last 4 digits of transaction |
| status | enum | pending, confirmed |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/amkyawdev/marketplace-app.git

# Navigate to the project
cd marketplace-app

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

1. Create a new Supabase project
2. Run the SQL migration in `supabase/migrations/001_initial_schema.sql`
3. Configure Row Level Security (RLS) policies

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔒 Security

- **Supabase RLS**: Users can only see their own verification documents
- **Public Product Listings**: Everyone can view products
- **Verified Users Only**: Product posting restricted to `is_verified = true` users
- **Secure Payment Flow**: Escrow-style 30% down payment

## 📱 Pages

| Page | Description |
|------|-------------|
| `/` | Landing page with featured products |
| `/auth/login` | User login with Google OAuth |
| `/auth/signup` | Signup with NRC verification |
| `/products` | Browse all products |
| `/products/[id]` | Product details with payment |
| `/products/create` | Create new listing (verified users) |
| `/dashboard` | User dashboard (orders & inventory) |

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Supabase (Auth, DB, Storage)
- **Deployment**: Vercel (recommended)

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with ❤️ for Myanmar's C2C marketplace community 🇲🇲

This README was generated by an AI assistant (OpenHands) on behalf of amkyawdev.