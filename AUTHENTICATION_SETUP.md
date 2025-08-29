# 🔐 Beam Participant Authentication & Onboarding System

## Overview

This document outlines the comprehensive authentication and onboarding system for Beam participants in the Hood application. The system provides two distinct user types:

1. **Community Subscribers** - Users who subscribe to neighborhood services ($75/month)
2. **Beam Participants** - Students, alumni, and community partners who engage in governance

## 🏗️ System Architecture

### File Structure
```
lib/supabase/
├── auth.ts              # Authentication utilities and mock data
└── governance.ts        # Governance data queries

components/auth/
├── LoginModal.tsx       # Google OAuth login modal
└── OnboardingModal.tsx  # First-time participant onboarding

app/
├── dashboard/page.tsx   # Unified dashboard for both user types
└── page.tsx            # Home page with login button
```

### Database Schema (Future Supabase Implementation)

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supabase_id UUID UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Participants Table
```sql
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  university TEXT NOT NULL,
  status TEXT CHECK (status IN ('enrolled', 'alumni')),
  role TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🚀 Features

### 1. Header Login Link
- **Location**: Added to home page header navigation
- **Style**: Consistent with other navigation links (13px font, gray hover effects)
- **Function**: Opens login modal on click

### 2. Google OAuth Integration
- **Provider**: Google OAuth via Supabase Auth
- **Scope**: School email addresses preferred
- **Flow**: Redirects to dashboard after successful authentication

### 3. Participant Onboarding
- **Trigger**: First-time login for Beam participants
- **Fields**:
  - University/College (dropdown with major Florida universities)
  - Status (Enrolled/Alumni radio buttons)
  - Desired Role (Student Director, Alumni Coordinator, Community Partner, Volunteer)
  - City (dropdown with major Florida cities)
- **Validation**: All fields required before submission

### 4. Dual Dashboard System
- **Community Dashboard**: For subscribers (existing functionality)
- **Participant Dashboard**: For Beam participants with governance access

## 🔧 Implementation Details

### Authentication Flow
1. User clicks "Login" in header
2. Login modal opens with Google OAuth button
3. User authenticates with Google
4. System checks if user exists in participants table
5. If first-time user → Onboarding modal
6. If returning participant → Direct to dashboard
7. If community user → Community dashboard

### Mock Data System
- **Current Status**: Uses mock data for development
- **Purpose**: Allows full testing without Supabase package
- **Migration**: Easy switch to real Supabase when package installed

### State Management
- **Home Page**: `showLoginModal` state for login modal
- **Dashboard**: `showOnboarding` state for onboarding flow
- **User Context**: Manages authentication state across components

## 🎯 User Experience

### Login Modal
- **Design**: Clean, centered modal with Google branding
- **Loading States**: Spinner during authentication
- **Error Handling**: User-friendly error messages
- **Accessibility**: Proper focus management and keyboard navigation

### Onboarding Modal
- **Progressive Form**: Logical field progression
- **Validation**: Real-time field validation
- **Success Feedback**: Clear completion confirmation
- **Responsive**: Works on all device sizes

### Dashboard Routing
- **Smart Detection**: Automatically determines user type
- **Quick Actions**: Direct links to relevant sections
- **Profile Summary**: Displays user information clearly

## 🔄 Integration Points

### Governance System
- **Leadership Roles**: Automatically populated from participants table
- **City-Specific Data**: Filters governance data by participant's city
- **Voting Rights**: Participants can vote on governance decisions

### City Pages
- **Service Access**: Participants can explore services in their city
- **Donation Tracking**: Links participant activity to city services
- **Work Orders**: Submit and track community service requests

## 🚧 Current Status & Next Steps

### ✅ Completed
- [x] Authentication utilities with mock data
- [x] Login modal component
- [x] Onboarding modal component
- [x] Unified dashboard system
- [x] Header login integration
- [x] Mock data for development

### 🔄 In Progress
- [ ] Supabase package installation (pending disk space)
- [ ] Real database integration
- [ ] Google OAuth configuration

### 📋 Next Steps
1. **Install Supabase Package**
   ```bash
   npm install @supabase/supabase-js
   # or
   pnpm add @supabase/supabase-js
   ```

2. **Configure Environment Variables**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Enable Google OAuth in Supabase**
   - Go to Authentication > Providers
   - Enable Google provider
   - Configure OAuth credentials

4. **Create Database Tables**
   - Run the SQL schema provided above
   - Set up Row Level Security (RLS) policies

5. **Replace Mock Data**
   - Uncomment Supabase code in `lib/supabase/auth.ts`
   - Remove mock data arrays
   - Test with real authentication

## 🧪 Testing

### Development Testing
- **Mock Login**: Use the mock Google OAuth in development
- **Onboarding Flow**: Test all form fields and validation
- **Dashboard Routing**: Verify correct dashboard display
- **Navigation**: Test all quick action buttons

### Production Testing
- **Google OAuth**: Test real Google authentication
- **Database Integration**: Verify data persistence
- **Error Handling**: Test network failures and edge cases
- **Performance**: Monitor authentication response times

## 🔒 Security Considerations

### Authentication
- **OAuth 2.0**: Secure Google authentication flow
- **Session Management**: Proper token handling
- **Logout**: Secure session termination

### Data Protection
- **Row Level Security**: Database-level access control
- **Input Validation**: Form field sanitization
- **Error Messages**: No sensitive information exposure

### Privacy
- **Data Minimization**: Only collect necessary information
- **User Consent**: Clear terms and privacy policy
- **Data Retention**: Appropriate data lifecycle management

## 📱 Responsive Design

### Mobile Optimization
- **Touch Targets**: Proper button sizes for mobile
- **Form Layout**: Optimized for small screens
- **Navigation**: Mobile-friendly header layout

### Desktop Enhancement
- **Modal Sizing**: Appropriate proportions for large screens
- **Grid Layouts**: Responsive dashboard grids
- **Hover Effects**: Enhanced desktop interactions

## 🎨 UI/UX Guidelines

### Design System
- **Colors**: Consistent with existing Hood theme
- **Typography**: Sans-serif font family
- **Spacing**: 8px grid system
- **Shadows**: Subtle elevation effects

### Component Patterns
- **Modals**: Consistent modal design language
- **Buttons**: Gradient buttons with hover effects
- **Forms**: Clean, accessible form design
- **Loading States**: Clear feedback during operations

## 🔍 Troubleshooting

### Common Issues
1. **Login Modal Not Opening**
   - Check `showLoginModal` state
   - Verify button click handler

2. **Onboarding Not Triggering**
   - Check `isFirstTimeUser` function
   - Verify participant data creation

3. **Dashboard Routing Issues**
   - Check user authentication state
   - Verify participant data exists

4. **Mock Data Not Working**
   - Ensure mock functions are properly exported
   - Check import statements

### Debug Mode
- **Console Logs**: Authentication flow logging
- **State Inspection**: React DevTools for state debugging
- **Network Requests**: Monitor API calls (when Supabase integrated)

## 📚 Additional Resources

### Documentation
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Authentication](https://nextjs.org/docs/authentication)

### Code Examples
- See `lib/supabase/auth.ts` for authentication patterns
- See `components/auth/` for component implementations
- See `app/dashboard/page.tsx` for dashboard logic

---

## 🎉 Summary

The Beam Participant Authentication & Onboarding System provides a comprehensive solution for managing two distinct user types in the Hood application. With its modular design, mock data support, and easy migration path to Supabase, the system is ready for immediate development and testing.

The dual dashboard approach ensures that both community subscribers and governance participants have appropriate access to relevant features, while the onboarding flow ensures new participants can quickly get started with their governance activities.

**Ready for development and testing! 🚀**
