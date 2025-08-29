import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Temporary mock data until Supabase is properly configured
const mockLeadershipData: { [city: string]: LeadershipMember[] } = {
  'orlando': [
    {
      id: '1',
      name: 'Sarah Chen',
      role: 'Student Director',
      type: 'student',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      bio: 'Computer Science major, passionate about community technology initiatives',
      city: 'orlando',
      created_at: '2024-01-01T00:00:00.000Z'
    },
    {
      id: '2',
      name: 'Marcus Rodriguez',
      role: 'Alumni Coordinator',
      type: 'alumni',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'Graduated 2022, now working in urban planning',
      city: 'orlando',
      created_at: '2024-01-01T00:00:00.000Z'
    },
    {
      id: '3',
      name: 'Dr. Emily Watson',
      role: 'Community Partner',
      type: 'community_partner',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      bio: 'Local healthcare provider, supporting wellness programs',
      city: 'orlando',
      created_at: '2024-01-01T00:00:00.000Z'
    }
  ],
  'miami': [
    {
      id: '4',
      name: 'Alex Johnson',
      role: 'Student Director',
      type: 'student',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'Environmental Science major, focused on coastal community resilience',
      city: 'miami',
      created_at: '2024-01-01T00:00:00.000Z'
    }
  ]
}

const mockDonationData: { [city: string]: DonationActivity[] } = {
  'orlando': [
    {
      id: '1',
      amount: 250,
      category: 'Healthcare & Wellness',
      date: '2024-01-15',
      donor_type: 'individual',
      city: 'orlando',
      created_at: '2024-01-15T00:00:00.000Z'
    },
    {
      id: '2',
      amount: 75,
      category: 'Subscription',
      date: '2024-01-01',
      donor_type: 'subscription',
      city: 'orlando',
      created_at: '2024-01-01T00:00:00.000Z'
    },
    {
      id: '3',
      amount: 1000,
      category: 'Education & Skills',
      date: '2024-01-10',
      donor_type: 'corporate',
      city: 'orlando',
      created_at: '2024-01-10T00:00:00.000Z'
    }
  ],
  'miami': [
    {
      id: '4',
      amount: 500,
      category: 'Environment & Green',
      date: '2024-01-20',
      donor_type: 'individual',
      city: 'miami',
      created_at: '2024-01-20T00:00:00.000Z'
    }
  ]
}

const mockGovernanceLogs: { [city: string]: GovernanceLog[] } = {
  'orlando': [
    {
      id: '1',
      decision_type: 'Budget Allocation',
      title: 'Q1 2024 Budget Distribution',
      description: 'Approved allocation of $15,000 for community garden expansion',
      date: '2024-01-20',
      status: 'approved',
      city: 'orlando',
      votes_for: 12,
      votes_against: 2,
      total_votes: 14,
      created_at: '2024-01-20T00:00:00.000Z',
      updated_at: '2024-01-20T00:00:00.000Z'
    },
    {
      id: '2',
      decision_type: 'Service Expansion',
      title: 'New Healthcare Initiative',
      description: 'Proposed monthly health screening program for seniors',
      date: '2024-01-18',
      status: 'proposed',
      city: 'orlando',
      votes_for: 8,
      votes_against: 3,
      total_votes: 11,
      created_at: '2024-01-18T00:00:00.000Z',
      updated_at: '2024-01-18T00:00:00.000Z'
    }
  ],
  'miami': [
    {
      id: '3',
      decision_type: 'Environmental Policy',
      title: 'Coastal Protection Initiative',
      description: 'Proposed funding for mangrove restoration project',
      date: '2024-01-22',
      status: 'proposed',
      city: 'miami',
      votes_for: 15,
      votes_against: 1,
      total_votes: 16,
      created_at: '2024-01-22T00:00:00.000Z',
      updated_at: '2024-01-22T00:00:00.000Z'
    }
  ]
}

const mockTransparencyMetrics: { [city: string]: TransparencyMetrics } = {
  'orlando': {
    city: 'orlando',
    total_allocated: 15000,
    total_received: 1325,
    allocation_breakdown: {
      education: 35,
      healthcare: 25,
      environment: 20,
      infrastructure: 15,
      community_services: 5
    },
    service_unlock_progress: {
      cleaning_tier: 75,
      food_tier: 45,
      healthcare_tier: 60,
      education_tier: 80
    },
    last_updated: '2024-01-25T00:00:00.000Z'
  },
  'miami': {
    city: 'miami',
    total_allocated: 8000,
    total_received: 500,
    allocation_breakdown: {
      education: 20,
      healthcare: 15,
      environment: 45,
      infrastructure: 10,
      community_services: 10
    },
    service_unlock_progress: {
      cleaning_tier: 60,
      food_tier: 30,
      healthcare_tier: 40,
      education_tier: 55
    },
    last_updated: '2024-01-25T00:00:00.000Z'
  }
}

// Type definitions
export interface LeadershipMember {
  id: string
  name: string
  role: string
  type: 'student' | 'alumni' | 'community_partner'
  avatar: string
  bio: string
  city: string
  created_at: string
}

export interface DonationActivity {
  id: string
  amount: number
  category: string
  date: string
  donor_type: 'individual' | 'subscription' | 'corporate'
  city: string
  donor_email?: string
  created_at: string
}

export interface GovernanceLog {
  id: string
  decision_type: string
  title: string
  description: string
  date: string
  status: 'proposed' | 'approved' | 'implemented' | 'rejected'
  city: string
  votes_for: number
  votes_against: number
  total_votes: number
  created_at: string
  updated_at: string
}

export interface TransparencyMetrics {
  city: string
  total_allocated: number
  total_received: number
  allocation_breakdown: {
    education: number
    healthcare: number
    environment: number
    infrastructure: number
    community_services: number
  }
  service_unlock_progress: {
    cleaning_tier: number
    food_tier: number
    healthcare_tier: number
    education_tier: number
  }
  last_updated: string
}

// Leadership Team Queries
export const getLeadershipByCity = async (city: string): Promise<LeadershipMember[]> => {
  try {
    // TODO: Replace with actual Supabase query when package is installed
    // const { data, error } = await supabase
    //   .from('leadership_team')
    //   .select('*')
    //   .eq('city', city)
    //   .order('created_at', { ascending: false })
    // if (error) throw error
    // return data || []
    
    // Temporary mock data
    return mockLeadershipData[city] || []
  } catch (error) {
    console.error('Error fetching leadership team:', error)
    return []
  }
}

export const addLeadershipMember = async (member: Omit<LeadershipMember, 'id' | 'created_at'>): Promise<LeadershipMember | null> => {
  try {
    const { data, error } = await supabase
      .from('leadership_team')
      .insert([member])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error adding leadership member:', error)
    return null
  }
}

// Donation Activity Queries
export const getDonationActivityByCity = async (city: string): Promise<DonationActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('city', city)
      .order('created_at', { ascending: false })
      .limit(50)
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching donation activity:', error)
    return []
  }
}

export const getSubscriptionActivityByCity = async (city: string): Promise<DonationActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('city', city)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching subscription activity:', error)
    return []
  }
}

// Governance Logs Queries
export const getGovernanceLogsByCity = async (city: string): Promise<GovernanceLog[]> => {
  try {
    const { data, error } = await supabase
      .from('governance_logs')
      .select('*')
      .eq('city', city)
      .order('created_at', { ascending: false })
      .limit(20)
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching governance logs:', error)
    return []
  }
}

export const addGovernanceLog = async (log: Omit<GovernanceLog, 'id' | 'created_at' | 'updated_at'>): Promise<GovernanceLog | null> => {
  try {
    const { data, error } = await supabase
      .from('governance_logs')
      .insert([log])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error adding governance log:', error)
    return null
  }
}

export const updateGovernanceLogStatus = async (id: string, status: GovernanceLog['status']): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('governance_logs')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error updating governance log status:', error)
    return false
  }
}

// Transparency Metrics Queries
export const getTransparencyMetricsByCity = async (city: string): Promise<TransparencyMetrics | null> => {
  try {
    // TODO: Replace with actual Supabase queries when package is installed
    // Get total received from donations
    // const { data: donations, error: donationsError } = await supabase
    //   .from('donations')
    //   .select('amount')
    //   .eq('city', city)
    // if (donationsError) throw donationsError

    // Get total allocated from budget allocations
    // const { data: allocations, error: allocationsError } = await supabase
    //   .from('budget_allocations')
    //   .select('amount, category')
    //   .eq('city', city)
    //   .eq('status', 'approved')
    // if (allocationsError) throw allocationsError

    // Get service unlock progress from service tiers
    // const { data: serviceTiers, error: serviceError } = await supabase
    //   .from('service_tiers')
    //   .select('*')
    //   .eq('city', city)
    // if (serviceError) throw serviceError

    // Calculate metrics
    // const totalReceived = donations?.reduce((sum, d) => sum + d.amount, 0) || 0
    // const totalAllocated = allocations?.reduce((sum, a) => sum + a.amount, 0) || 0

    // Calculate allocation breakdown
    // const allocationBreakdown = {
    //   education: 0,
    //   healthcare: 0,
    //   environment: 0,
    //   infrastructure: 0,
    //   community_services: 0
    // }

    // allocations?.forEach(allocation => {
    //   const category = allocation.category.toLowerCase()
    //   if (category in allocationBreakdown) {
    //     allocationBreakdown[category as keyof typeof allocationBreakdown] += allocation.amount
    //   }
    // })

    // Convert to percentages
    // if (totalAllocated > 0) {
    //   Object.keys(allocationBreakdown).forEach(key => {
    //     allocationBreakdown[key as keyof typeof allocationBreakdown] = 
    //       Math.round((allocationBreakdown[key as keyof typeof allocationBreakdown] / totalAllocated) * 100)
    //   })
    // }

    // Calculate service unlock progress
    // const serviceUnlockProgress = {
    //   cleaning_tier: serviceTiers?.find(t => t.name === 'cleaning')?.progress || 0,
    //   food_tier: serviceTiers?.find(t => t.name === 'food')?.progress || 0,
    //   healthcare_tier: serviceTiers?.find(t => t.name === 'healthcare')?.progress || 0,
    //   education_tier: serviceTiers?.find(t => t.name === 'education')?.progress || 0
    // }

    // return {
    //   city,
    //   total_allocated: totalAllocated,
    //   total_received: totalReceived,
    //   allocation_breakdown: allocationBreakdown,
    //   service_unlock_progress: serviceUnlockProgress,
    //   last_updated: new Date().toISOString()
    // }
    
    // Temporary mock data
    return mockTransparencyMetrics[city] || null
  } catch (error) {
    console.error('Error fetching transparency metrics:', error)
    return null
  }
}

// Voting Queries
export const submitVote = async (logId: string, userId: string, vote: 'for' | 'against'): Promise<boolean> => {
  try {
    // Check if user already voted
    const { data: existingVote } = await supabase
      .from('governance_votes')
      .select('*')
      .eq('log_id', logId)
      .eq('user_id', userId)
      .single()

    if (existingVote) {
      // Update existing vote
      const { error } = await supabase
        .from('governance_votes')
        .update({ vote, updated_at: new Date().toISOString() })
        .eq('id', existingVote.id)

      if (error) throw error
    } else {
      // Create new vote
      const { error } = await supabase
        .from('governance_votes')
        .insert([{
          log_id: logId,
          user_id: userId,
          vote,
          created_at: new Date().toISOString()
        }])

      if (error) throw error
    }

    // Update vote counts in governance log
    const { data: log } = await supabase
      .from('governance_logs')
      .select('votes_for, votes_against, total_votes')
      .eq('id', logId)
      .single()

    if (log) {
      let votesFor = log.votes_for
      let votesAgainst = log.votes_against

      if (existingVote) {
        // Remove old vote
        if (existingVote.vote === 'for') votesFor--
        else votesAgainst--
      }

      // Add new vote
      if (vote === 'for') votesFor++
      else votesAgainst++

      const { error: updateError } = await supabase
        .from('governance_logs')
        .update({
          votes_for: votesFor,
          votes_against: votesAgainst,
          total_votes: votesFor + votesAgainst,
          updated_at: new Date().toISOString()
        })
        .eq('id', logId)

      if (updateError) throw updateError
    }

    return true
  } catch (error) {
    console.error('Error submitting vote:', error)
    return false
  }
}

// Utility function to check if city has governance data
export const hasGovernanceData = async (city: string): Promise<boolean> => {
  try {
    // TODO: Replace with actual Supabase queries when package is installed
    // const [leadership, donations, logs] = await Promise.all([
    //   getLeadershipByCity(city),
    //   getDonationActivityByCity(city),
    //   getGovernanceLogsByCity(city)
    // ])
    // return leadership.length > 0 || donations.length > 0 || logs.length > 0
    
    // Temporary mock data check
    const hasData = mockLeadershipData[city] || mockDonationData[city] || mockGovernanceLogs[city]
    return !!hasData
  } catch (error) {
    console.error('Error checking governance data:', error)
    return false
  }
}
