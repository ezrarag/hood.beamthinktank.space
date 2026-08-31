import { ParticipantProfile } from './firebase'

export interface DivisionInfo {
  id: 'orchestra' | 'forge' | 'law' | 'grounds' | 'dance' | 'education' | 'transportation' | 'business' | 'architecture'
  name: string
  icon: string
  color: string
  description: string
  subdomain: string
}

export const BEAM_DIVISIONS: DivisionInfo[] = [
  {
    id: 'orchestra',
    name: 'Orchestra',
    icon: '🎻',
    color: 'emerald',
    description: 'Chamber stipends, Steinway recording sessions, and performance portfolios.',
    subdomain: 'orchestra.beamthinktank.space'
  },
  {
    id: 'forge',
    name: 'Forge',
    icon: '⚡',
    color: 'blue',
    description: 'Open-source software incubators, hardware prototypes, and civic tech.',
    subdomain: 'forge.beamthinktank.space'
  },
  {
    id: 'law',
    name: 'Law',
    icon: '⚖️',
    color: 'amber',
    description: 'Pro bono advocacy, legal defense cohorts, and civic rights triage.',
    subdomain: 'law.beamthinktank.space'
  },
  {
    id: 'grounds',
    name: 'Grounds',
    icon: '🌱',
    color: 'green',
    description: 'Community gardens, urban agriculture, and sustainable land nodes.',
    subdomain: 'grounds.beamthinktank.space'
  },
  {
    id: 'dance',
    name: 'Dance',
    icon: '💃',
    color: 'rose',
    description: 'Movement labs, choreography residencies, and performance stipends.',
    subdomain: 'dance.beamthinktank.space'
  },
  {
    id: 'education',
    name: 'Education',
    icon: '🎓',
    color: 'purple',
    description: 'Youth mentorship, music academies, and skill building workshops.',
    subdomain: 'education.beamthinktank.space'
  },
  {
    id: 'transportation',
    name: 'Transportation',
    icon: '🚗',
    color: 'cyan',
    description: 'Community transit, vehicle repair cohorts, and mobility access.',
    subdomain: 'transportation.beamthinktank.space'
  },
  {
    id: 'business',
    name: 'Business',
    icon: '💼',
    color: 'indigo',
    description: 'Micro-enterprise development and local business accelerators.',
    subdomain: 'business.beamthinktank.space'
  },
  {
    id: 'architecture',
    name: 'BEAM Architecture',
    icon: '📐',
    color: 'orange',
    description: 'Structural and redevelopment design work across BEAM sites.',
    subdomain: 'grounds.beamthinktank.space'
  }
]

export const CROSS_DIVISION_ROSTER: ParticipantProfile[] = [
  // 1. Ezra Haugabrooks - Verified Platform Profile
  {
    fullName: 'Ezra Haugabrooks',
    email: 'ezra.haugabrooks@gmail.com',
    primaryRole: 'BEAM Ecosystem Steward & Senior Fellow',
    division: 'orchestra',
    entityType: 'individual',
    primaryInstrument: 'Violin / Full-Stack Systems',
    homeHub: 'Atlanta Node #4 (Steinway Sessions)',
    originProject: 'Black Diaspora Symphony Orchestra & BEAM Forge',
    hoodVillageBalance: 3850,
    bio: 'BEAM Platform Fellow & Systems Lead. Coordinating patron village backing, Steinway recording stipends, and open-source software/hardware projects across all BEAM divisions.',
    skillsOrTags: ['Steinway Fellow', 'BDSO Violin', 'BEAM Steward', 'Full-Stack Software'],
    activeDivisions: ['orchestra', 'forge', 'architecture'],
    hoodAllocations: {
      travelPercent: 40,
      housingPercent: 35,
      mealsPercent: 15,
      maintenancePercent: 10,
    },
    portfolioMedia: [
      { id: '1', title: 'Black Diaspora Symphony Recital', url: 'https://orchestra.beamthinktank.space/profile?musician=ezra.haugabrooks@gmail.com', category: 'Recording' },
      { id: '2', title: 'BEAM Ecosystem Architecture', url: 'https://forge.beamthinktank.space', category: 'Systems' }
    ]
  },

  // 2. BDSO Institutional Cohort (Orchestra Division)
  {
    fullName: 'Black Diaspora Symphony Orchestra (BDSO Cohort)',
    email: 'bdso-cohort@beam.org',
    primaryRole: 'Institutional Performance Cohort',
    division: 'orchestra',
    entityType: 'cohort',
    cohortName: 'Black Diaspora Symphony Orchestra',
    primaryInstrument: 'Full Symphony & Chamber Ensembles',
    homeHub: 'Atlanta & Milwaukee Hubs',
    originProject: 'BEAM Orchestra Initiative',
    hoodVillageBalance: 12400,
    bio: 'Institutional symphony cohort supporting 18 resident fellows with travel, lodging, meal stipends, and luthier maintenance for Steinway hall recording sessions.',
    skillsOrTags: ['Symphony Cohort', 'Steinway Recordings', '18 Active Fellows'],
    hoodAllocations: {
      travelPercent: 45,
      housingPercent: 30,
      mealsPercent: 15,
      maintenancePercent: 10,
    }
  },

  // 3. Elena Rostova (Orchestra Division)
  {
    fullName: 'Elena Rostova',
    email: 'elena.rostova@beam.org',
    primaryRole: 'Steinway Recording Fellow & Principal Violinist',
    division: 'orchestra',
    entityType: 'individual',
    primaryInstrument: 'Violin',
    homeHub: 'Atlanta Node #4',
    originProject: 'BEAM Chamber Orchestra',
    hoodVillageBalance: 2450,
    bio: 'Specializing in baroque and contemporary solo violin repertoire. Passionate about community music education.',
    skillsOrTags: ['Baroque Violin', 'Steinway Fellow', 'Soloist'],
    hoodAllocations: { travelPercent: 40, housingPercent: 35, mealsPercent: 15, maintenancePercent: 10 }
  },

  // 4. Forge Tech Incubator Cohort (Forge Division)
  {
    fullName: 'BEAM Forge Open-Source Hardware Incubator',
    email: 'forge-cohort@beam.org',
    primaryRole: 'Institutional Civic Tech Cohort',
    division: 'forge',
    entityType: 'cohort',
    cohortName: 'Forge Incubator',
    primaryInstrument: 'Full-Stack & Hardware Engineering',
    homeHub: 'Decatur Tech Node',
    originProject: 'BEAM Forge Division',
    hoodVillageBalance: 8600,
    bio: 'Civic tech cohort building open-source firmware, device triage tools, and community hardware kiosks.',
    skillsOrTags: ['Hardware Kiosks', 'Open Source', 'Device Triage'],
    hoodAllocations: { travelPercent: 30, housingPercent: 40, mealsPercent: 15, maintenancePercent: 15 }
  },

  // 5. Marcus Vance (Forge & Education Division)
  {
    fullName: 'Marcus Vance',
    email: 'marcus.vance@beam.org',
    primaryRole: 'Resident Cellist & Hardware Instructor',
    division: 'forge',
    entityType: 'individual',
    primaryInstrument: 'Cello & Audio Electronics',
    homeHub: 'Decatur Community Node',
    originProject: 'BEAM Sound Lab',
    hoodVillageBalance: 1890,
    bio: 'Performing and teaching low-strings workshops and audio gear repair for urban youth academies.',
    skillsOrTags: ['Cello Instructor', 'Audio Repair', 'Youth Mentor'],
    hoodAllocations: { travelPercent: 35, housingPercent: 35, mealsPercent: 15, maintenancePercent: 15 }
  },

  // 6. Legal Defense Clinic Cohort (Law Division)
  {
    fullName: 'BEAM Pro Bono Legal Aid Cohort',
    email: 'law-cohort@beam.org',
    primaryRole: 'Institutional Legal Advocacy Cohort',
    division: 'law',
    entityType: 'cohort',
    cohortName: 'Legal Aid Fellows',
    primaryInstrument: 'Housing Rights & Pro Bono Defense',
    homeHub: 'Midtown Legal Hub',
    originProject: 'BEAM Law Division',
    hoodVillageBalance: 9500,
    bio: 'Pro bono legal advocate cohort providing tenant rights triage, legal representation, and eviction prevention for community members.',
    skillsOrTags: ['Pro Bono Defense', 'Tenant Rights', 'Legal Aid'],
    hoodAllocations: { travelPercent: 20, housingPercent: 50, mealsPercent: 20, maintenancePercent: 10 }
  },

  // 7. Sophia Liang (Education & Orchestra)
  {
    fullName: 'Sophia Liang',
    email: 'sophia.liang@beam.org',
    primaryRole: 'Guest Piano Fellow & Luthier Apprentice',
    division: 'education',
    entityType: 'individual',
    primaryInstrument: 'Piano / Harpsichord',
    homeHub: 'Midtown Hub #1',
    originProject: 'BEAM Steinway Recording Sessions',
    hoodVillageBalance: 3100,
    bio: 'Chamber accompanist and Steinway recording artist working on accessible community recitals and youth workshops.',
    skillsOrTags: ['Piano Accompanist', 'Harpsichord', 'Masterclasses'],
    hoodAllocations: { travelPercent: 50, housingPercent: 25, mealsPercent: 15, maintenancePercent: 10 }
  }
]
