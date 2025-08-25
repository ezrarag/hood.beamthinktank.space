# 🌍 Neighbor Hood - Community Platform

A modern, minimalist portfolio-style landing page for the Neighbor Hood community platform, inspired by clean design aesthetics and built with Next.js and Framer Motion.

## ✨ What's New (Portfolio Design v3.0)

This redesign transforms the Hood dashboard into a **clean, minimalist portfolio landing page** that matches the aesthetic of professional portfolio sites:

- **Portfolio-style layout** with large hero text and background image
- **Clean, modern typography** using Instrument Sans font family
- **Background image integration** with gaussian blur overlay
- **Smooth Framer Motion animations** for engaging user experience
- **Minimalist navigation** with dynamic city detection (currently Atlanta)
- **Interactive dashboard modal** accessible via the Dashboard button

## 🎨 Design Features

### 1. Portfolio Aesthetic
- **Large hero text** (64px) with compelling messaging
- **Background image** from Framer template with gaussian blur overlay
- **Clean typography** using Instrument Sans Medium/Bold
- **Minimal color palette** (black, white, grays, purple accent)

### 2. Navigation & Layout
- **Header**: Neighbor Hood logo, dynamic city navigation, Build CTA button
- **Hero section**: Large centered text with background image
- **Two-column layout**: Status indicator + description on left, actions + showcase on right
- **Portfolio elements**: Project status, showcase cards, "Made in Framer" badge

### 3. Interactive Elements
- **Dashboard modal** with community statistics
- **Smooth animations** using Framer Motion
- **Responsive design** for mobile and desktop
- **Hover effects** on buttons and interactive elements

## 🛠 Tech Stack

- **Next.js 14** (App Router)
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **Instrument Sans** font family
- **Responsive design** with mobile-first approach

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Open browser** at `http://localhost:3000`

## 📱 Features

### Current Implementation
- ✅ Portfolio-style landing page
- ✅ Background image with gaussian blur
- ✅ Smooth animations and transitions
- ✅ Interactive dashboard modal
- ✅ Responsive design
- ✅ Clean typography with Instrument Sans

### Future Enhancements
- 🔄 Dynamic city detection based on user location
- 🔄 Full dashboard integration
- 🔄 Hood creation workflow
- 🔄 Community features and governance
- 🔄 BEAM service integration

## 🎯 Design Philosophy

This redesign follows modern portfolio design principles:
- **Minimalism**: Clean, uncluttered interface
- **Typography**: Large, readable text with proper hierarchy
- **Visual hierarchy**: Clear information architecture
- **Smooth interactions**: Engaging animations that enhance UX
- **Professional aesthetic**: Suitable for community platform branding

## 🔧 Customization

### Fonts
The site uses Instrument Sans font family imported from Google Fonts:
```css
@import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
```

### Colors
- **Primary**: Black (#000000) for buttons and text
- **Secondary**: Purple (#7C3AED) for accent elements
- **Neutral**: Various grays for text and backgrounds
- **Accent**: Green (#10B981) for status indicators

### Animations
Framer Motion animations include:
- Header slide-in from top
- Hero text fade-in with upward motion
- Left/right column slide-ins
- Modal scale and fade transitions

## 📄 File Structure

```
app/
├── page.tsx          # Main landing page
├── layout.tsx        # Root layout with metadata
├── globals.css       # Global styles and font imports
└── governance/       # Governance page (existing)
```

## 🚀 Deployment

The site is ready for deployment to:
- Vercel (recommended for Next.js)
- Netlify
- Any static hosting platform

Build command: `npm run build`
Output directory: `.next/`

## 📝 License

This project is part of the Neighbor Hood community platform initiative.
