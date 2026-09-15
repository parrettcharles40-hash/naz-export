# NAZ EXPORT — Full-Stack E-Commerce & Wholesale Showcase

A production-ready full-stack export showcase website and administration management platform for **NAZ EXPORT**, a premier Iranian exporter specializing in certified Persian Saffron, Wild Herbal Teas, Premium Iranian Pistachios, and Lahijan Black Tea.

---

## 🌟 Key Features

1. **Brand Showcase & Iranian Visual Aesthetics**:
   - Palette inspired by Persian agriculture: light green canvas (`#EAF6EC` / `#F1F8F1`) with high-contrast forest text (`#1F3B2C`) and subtle warm accents.
   - **Continuous Left-to-Right Header Marquee**: Displays "NAZ EXPORT • PREMIUM IRANIAN PRODUCTS • WORLDWIDE BULK SHIPMENTS" and pauses smoothly on cursor hover.
   - **Slow Text Color-Shift Animation**: Hero headline cycles gently between dark emerald green, deep Persian saffron brown, and slate charcoal.
   - **3D Card Flips & Interactive Modals**: Interactive product cards featuring 3D perspective flip between high-resolution photography and wholesale specifications, plus full-detail export modals with Escape key, click, and outside-click dismiss.

2. **Direct Trade & Wholesale Communications**:
   - Prominently anchored **MOQ: 20 KG** badges across every single product card and sticky floating quick-inquiry badge.
   - **WhatsApp One-Click Direct Order**: Generates dynamic URLs prefilled with specific product names and 20 KG minimum order requests directly to `+989010192169`.
   - Direct Email to `niiiynaa76@gmail.com` with subject formatting.
   - Direct LinkedIn gateway to `https://www.linkedin.com/in/nedashirava-799538419`.

3. **Production REST API & Full-Stack Architecture**:
   - Built on Express with TypeScript.
   - Persistent database layer storing products, company details, and customer wholesale inquiries.
   - Multer file-upload engine for uploading and replacing product imagery.
   - JWT-authenticated Admin Panel at `/admin` (or via the Admin toggle in the navigation) with full CRUD operations.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Motion (Framer Motion API), Lucide Icons
- **Backend**: Node.js, Express, REST API
- **Persistence**: File-backed durable JSON store with pluggable MongoDB/PostgreSQL support
- **Image Storage**: Local `/uploads` with Multer disk storage and Cloudinary CDN configuration readiness
- **Authentication**: JWT token verification for protected administrative routes

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default administrative credentials:
- **Username**: `admin`
- **Password**: `admin123`
- **JWT Secret**: `naz_export_production_jwt_secret_key_change_in_production`

### 3. Run in Development
```bash
npm run dev
```
The server will start at `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 📦 Default Seed Catalog

- **Saffron**:
  - Traditional Dasteh Saffron — $1.20/gram
  - Super Negin Saffron — $1.80/gram
  - Sargol Persian Saffron — $1.50/gram
  - Saffron Root (White Part) — $0.90/gram
- **Herbal Products**:
  - Chamomile — $18.00/kg
  - Shirazi Thyme — $22.00/kg
  - Damask Rose Flowers — $25.00/kg
- **Premium Iranian Nuts**:
  - Premium Iranian Pistachios — $24.00/kg
  - Dried Fig — $16.00/kg
- **Black Tea**:
  - Black Tea — $14.00/kg
  - Lahijan Black Tea — $18.00/kg
