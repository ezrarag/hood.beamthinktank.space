# Hood - Community Node Registration

A modern web application that combines location-based community building with donation-driven perks. Think Nextdoor meets Patreon — map-based neighborhood nodes with goal tracking and reward systems.

## 🎯 Purpose

Let any community member create or join a "neighborhood node" linked to a donation/service pool. When donation milestones are reached, community perks automatically unlock.

## ✨ Features

### Step 1: Location-based Sign-up
- Enter address or zip code to find nearby community nodes
- Auto-create new nodes if none exist in the area
- Join existing nodes with active communities

### Step 2: Interactive Map Interface
- Visual representation of all community nodes
- Click markers to view detailed information
- Real-time location-based search

### Step 3: Node Management
- **Donation Goal Progress Bar**: Visual tracking of community funding
- **Available Perks**: List of unlocked and upcoming rewards
- **History Tracking**: Past events, services, and activities
- **Member Management**: Community size and engagement metrics

### Step 4: Milestone Trigger System
- Automatic perk unlocking at donation thresholds (25%, 50%, 75%, 100%)
- Real-time progress updates
- Community celebration of achievements

## 🎨 Design Philosophy

**Nextdoor + Patreon**: Combines the local community aspect of Nextdoor with the goal-oriented reward system of Patreon.

### Demo Perks for BEAM Band Orlando:
- 🎵 Free concert tickets
- 🎬 Access to recorded performances  
- 🎓 Priority access to community music workshops

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hood-community-nodes
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Maps**: Leaflet.js for interactive mapping
- **Animations**: Framer Motion for smooth interactions
- **Icons**: Lucide React for consistent iconography

## 🏗️ Project Structure

```
hood-community-nodes/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles and Tailwind
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main homepage
├── components/             # Reusable components
│   ├── LocationSignup.tsx # Address search and node creation
│   ├── NodeMap.tsx        # Interactive map with markers
│   └── NodeCard.tsx       # Detailed node information
├── public/                 # Static assets
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## 🎭 Demo Data

The application includes mock data for demonstration purposes:

- **Downtown Orlando Arts District**: $3,200/$5,000 goal
- **Mills 50 Creative Hub**: $1,800/$3,000 goal  
- **Thornton Park Community**: $2,800/$4,000 goal

Each node has unique perks and member counts to showcase the system's capabilities.

## 🔧 Customization

### Adding New Node Types
1. Update the mock data in `components/LocationSignup.tsx`
2. Add new perk categories
3. Modify milestone triggers as needed

### Styling Changes
- Custom colors defined in `tailwind.config.js`
- Component-specific styles in `app/globals.css`
- Responsive design using Tailwind breakpoints

### Map Configuration
- Leaflet map settings in `components/NodeMap.tsx`
- Default coordinates and zoom levels
- Marker customization and popup content

## 🚧 Future Enhancements

- [ ] User authentication and profiles
- [ ] Real-time donation tracking
- [ ] Payment integration (Stripe, PayPal)
- [ ] Mobile app development
- [ ] Social media integration
- [ ] Event management system
- [ ] Analytics dashboard
- [ ] Email notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **BEAM Band Orlando** for the inspiration and demo content
- **Nextdoor** for the community-focused approach
- **Patreon** for the milestone-based reward system concept
- **OpenStreetMap** for the mapping infrastructure

---

Built with ❤️ for community building and local engagement.
