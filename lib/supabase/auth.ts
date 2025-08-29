import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Type definitions
export interface User {
  id: string
  supabase_id: string
  email: string
  name?: string
  created_at: string
}

export interface Participant {
  id: string
  user_id: string
  university: string
  status: 'enrolled' | 'alumni'
  role?: string
  city?: string
  created_at: string
}

export interface AuthState {
  user: User | null
  participant: Participant | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Mock data arrays removed - now using real Supabase

// Authentication functions
export const signInWithGoogle = async (): Promise<{ user: User | null; error: string | null }> => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
    
    if (error) throw error
    
    // For now, return success - the actual user data will come from the redirect
    // In a real implementation, you'd handle the OAuth callback and get user data
    return { user: null, error: null }
  } catch (error) {
    console.error('Error signing in with Google:', error)
    return { user: null, error: 'Failed to sign in with Google' }
  }
}

export const signOut = async (): Promise<{ error: string | null }> => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    return { error: null }
  } catch (error) {
    console.error('Error signing out:', error)
    return { error: 'Failed to sign out' }
  }
}

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    
    // Check if user exists in our users table
    const { data: dbUser, error } = await supabase
      .from('users')
      .select('*')
      .eq('supabase_id', user.id)
      .single()
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error
    }
    
    if (dbUser) {
      return dbUser
    }
    
    // If user doesn't exist in our table, create them
    const newUser: User = {
      id: user.id,
      supabase_id: user.id,
      email: user.email || '',
      name: user.user_metadata?.full_name || user.user_metadata?.name,
      created_at: new Date().toISOString()
    }
    
    const { data: createdUser, error: createError } = await supabase
      .from('users')
      .insert([newUser])
      .select()
      .single()
    
    if (createError) throw createError
    
    return createdUser
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export const createOrUpdateUser = async (supabaseId: string, email: string, name?: string): Promise<User | null> => {
  try {
    // TODO: Replace with actual Supabase user creation when package is installed
    // const { data, error } = await supabase
    //   .from('users')
    //   .upsert([{ supabase_id: supabaseId, email, name }])
    //   .select()
    //   .single()
    
    // if (error) throw error
    // return data
    
    // Mock user creation for development
    const existingUser = Object.values(mockUsers).find(u => u.email === email)
    if (existingUser) {
      return existingUser
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      supabase_id: supabaseId,
      email,
      name,
      created_at: new Date().toISOString()
    }
    
    mockUsers[email] = newUser
    return newUser
  } catch (error) {
    console.error('Error creating/updating user:', error)
    return null
  }
}

export const createParticipant = async (
  userId: string, 
  university: string, 
  status: 'enrolled' | 'alumni', 
  role?: string, 
  city?: string
): Promise<Participant | null> => {
  try {
    const { data, error } = await supabase
      .from('participants')
      .insert([{ user_id: userId, university, status, role, city }])
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating participant:', error)
    return null
  }
}

export const getParticipantByUserId = async (userId: string): Promise<Participant | null> => {
  try {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error
    }
    
    return data
  } catch (error) {
    console.error('Error getting participant:', error)
    return null
  }
}

export const updateParticipant = async (
  userId: string, 
  updates: Partial<Omit<Participant, 'id' | 'user_id' | 'created_at'>>
): Promise<Participant | null> => {
  try {
    const { data, error } = await supabase
      .from('participants')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating participant:', error)
    return null
  }
}

// Utility functions
export const isFirstTimeUser = async (userId: string): Promise<boolean> => {
  const participant = await getParticipantByUserId(userId)
  return !participant
}

export const getUserRole = async (userId: string): Promise<string | null> => {
  try {
    // First check if user exists in participants table
    const participant = await getParticipantByUserId(userId)
    if (participant?.role) {
      console.log(`🔍 User role detected: ${participant.role}`)
      return participant.role
    }
    
    // If no role in participants, check if they're a community user
    // For now, assume community if no participant record exists
    console.log('🔍 No participant role found, defaulting to community')
    return 'community'
  } catch (error) {
    console.error('Error getting user role:', error)
    return 'community' // Default fallback
  }
}

export const getUserCity = async (userId: string): Promise<string | null> => {
  const participant = await getParticipantByUserId(userId)
  return participant?.city || null
}

// New function to determine dashboard type
export const getUserDashboardType = async (userId: string): Promise<'community' | 'participant'> => {
  try {
    const role = await getUserRole(userId)
    console.log(`🎯 Dashboard type determined: ${role === 'participant' ? 'Participant Dashboard' : 'Community Dashboard'}`)
    
    if (role === 'participant') {
      return 'participant'
    } else {
      return 'community'
    }
  } catch (error) {
    console.error('Error determining dashboard type:', error)
    return 'community' // Default fallback
  }
}
