# 🌍 Hood Dashboard - Global Community Network

A modern, transparent dashboard for tracking how BEAM neighborhoods ("Hoods") work together and how donations translate into community services.

## ✨ What's New (Refactor v2.0)

This refactor transforms the original "Community Node Registration" into a comprehensive **Global Hood Dashboard** with:

- **Clean, modern design** inspired by professional portfolio aesthetics
- **Global overview** with donation totals and progress tracking
- **Donation tier system** showing service unlocks at each milestone
- **Enhanced map visualization** with Hood progress and service status
- **Governance transparency** page explaining the decision-making process
- **Framer Motion animations** for smooth, engaging user experience

## 🚀 Core Features

### 1. Global Hood Overview
- Map of all active Hoods (cities/neighborhoods)
- Donation totals per Hood with progress visualization
- Service unlock tiers and community benefits
- Real-time statistics and metrics

### 2. Hood Detail Pages
- Progress bars showing current vs. next unlock tier
- List of unlocked services and upcoming classes
- Service request history and fulfillment tracking
- Member management and community engagement

### 3. Donation Tiers & Allocation
- **$500** → Classes (music workshops, art classes, skill sharing)
- **$1,000** → Cleaning (park maintenance, street cleaning, gardens)
- **$2,000** → Food (community meals, food banks, grocery assistance)
- **$5,000** → Transportation (rideshare, bike sharing, transit passes)

### 4. NGO Service Mapping
- Visual representation of NGO collaboration in each Hood
- Service delivery tracking and status updates
- Partnership management and performance metrics

### 5. Governance & Transparency
- Community decision-making process explanation
- Donation flow: contributions → allocation → services
- Public blockchain tracking for complete transparency

## 🛠 Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: TailwindCSS with custom color scheme
- **Animations**: Framer Motion for smooth interactions
- **Maps**: Leaflet with React integration
- **Icons**: Lucide React icon library
- **Database**: Supabase (ready for integration)

## 🎨 Design System

### Color Palette
- **Hood Blues**: Community-focused primary colors
- **Beam Purples**: Innovation and growth accents
- **Success Greens**: Service unlocks and achievements
- **Neutral Grays**: Clean, professional backgrounds

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Gradient backgrounds with hover effects
- **Progress Bars**: Animated with gradient fills
- **Stats Grids**: Color-coded metric displays

## 📁 Project Structure

```
hood.beamthinktank.space/
├── app/
│   ├── globals.css          # Global styles and Tailwind config
│   ├── layout.tsx           # Root layout component
│   ├── page.tsx             # Main dashboard page
│   └── governance/          # Governance transparency page
│       └── page.tsx
├── components/
│   ├── LocationSignup.tsx   # Hood search and creation
│   ├── NodeCard.tsx         # Hood detail display
│   └── NodeMap.tsx          # Interactive map component
├── tailwind.config.js       # Custom color scheme
└── package.json             # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone [your-repo-url]
cd hood.beamthinktank.space

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🔄 Next Steps (Development Roadmap)

### Phase 1: MVP Enhancement ✅
- [x] Design system refactor
- [x] Global dashboard layout
- [x] Donation tier visualization
- [x] Enhanced map functionality
- [x] Governance page

### Phase 2: Core Features 🚧
- [ ] Supabase integration
- [ ] User authentication
- [ ] Real donation tracking
- [ ] Hood creation workflow
- [ ] Service request system

### Phase 3: Advanced Features 📋
- [ ] NGO partnership management
- [ ] Advanced analytics dashboard
- [ ] Mobile app optimization
- [ ] Skills site integration widget
- [ ] Blockchain transparency layer

### Phase 4: Scale & Polish 🎯
- [ ] Performance optimization
- [ ] SEO and accessibility
- [ ] Multi-language support
- [ ] Advanced reporting
- [ ] Community engagement tools

## 🌐 Integration Points

### Skills Site Widget
- **Location**: `skills.beamthinktank.space`
- **Purpose**: Show neighborhood progress
- **Action**: Redirect to Hood detail page

### Supabase Schema
```sql
-- Core tables ready for implementation
hoods, donations, tiers, services, governance_logs, ngos
```

## 🎯 Key Benefits

1. **Transparency**: Complete visibility into donation allocation
2. **Community**: Location-based service delivery
3. **Scalability**: Tier system grows with community needs
4. **Governance**: Democratic decision-making process
5. **Impact**: Clear connection between donations and services

## 🤝 Contributing

This project follows a structured development approach:
- **Design-first**: Clean, professional aesthetics
- **User-centered**: Community needs drive features
- **Transparency**: Open governance and decision tracking
- **Scalability**: Built to grow with community adoption

## 📞 Support & Contact

For questions about the Hood dashboard or development roadmap:
- **Project**: BEAM Think Tank
- **Focus**: Community service delivery through transparent donations
- **Vision**: Global network of self-governing neighborhoods

---

*Built with ❤️ for community empowerment and transparent governance*
