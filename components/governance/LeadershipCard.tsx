import { motion } from 'framer-motion'
import { LeadershipMember } from '@/lib/supabase/governance'

interface LeadershipCardProps {
  member: LeadershipMember
  index: number
}

export default function LeadershipCard({ member, index }: LeadershipCardProps) {
  const getTypeColor = (type: LeadershipMember['type']) => {
    switch (type) {
      case 'student':
        return 'bg-blue-100 text-blue-800'
      case 'alumni':
        return 'bg-green-100 text-green-800'
      case 'community_partner':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = (type: LeadershipMember['type']) => {
    return type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="text-center">
        <div className="relative mb-4">
          <img
            src={member.avatar}
            alt={member.name}
            className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{member.role}</p>
        
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(member.type)}`}>
          {getTypeLabel(member.type)}
        </span>
        
        <p className="text-sm text-gray-600 mt-3 leading-relaxed">{member.bio}</p>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Joined {new Date(member.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
