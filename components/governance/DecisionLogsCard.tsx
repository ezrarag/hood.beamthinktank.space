import { motion } from 'framer-motion'
import { GovernanceLog } from '@/lib/supabase/governance'

interface DecisionLogsCardProps {
  governanceLogs: GovernanceLog[]
  onVote?: (logId: string, vote: 'for' | 'against') => void
  currentUserId?: string
}

export default function DecisionLogsCard({ governanceLogs, onVote, currentUserId }: DecisionLogsCardProps) {
  const getStatusColor = (status: GovernanceLog['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'proposed':
        return 'bg-yellow-100 text-yellow-800'
      case 'implemented':
        return 'bg-blue-100 text-blue-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: GovernanceLog['status']) => {
    switch (status) {
      case 'approved':
        return '✅'
      case 'proposed':
        return '📋'
      case 'implemented':
        return '🚀'
      case 'rejected':
        return '❌'
      default:
        return '📝'
    }
  }

  const getVotePercentage = (votesFor: number, totalVotes: number) => {
    if (totalVotes === 0) return 0
    return Math.round((votesFor / totalVotes) * 100)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Recent Decisions</h3>
          <span className="text-sm text-gray-500">{governanceLogs.length} decisions</span>
        </div>
        
        <div className="space-y-4">
          {governanceLogs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getStatusIcon(log.status)}</span>
                  <span className="font-medium text-gray-900">{log.title}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                  {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">{log.description}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span className="flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{new Date(log.date).toLocaleDateString()}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{log.votes_for}/{log.total_votes} votes</span>
                </span>
              </div>

              {/* Voting Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Support</span>
                  <span>{getVotePercentage(log.votes_for, log.total_votes)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getVotePercentage(log.votes_for, log.total_votes)}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                  />
                </div>
              </div>

              {/* Decision Type Badge */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {log.decision_type}
                </span>
                
                {/* Voting Buttons (if user is logged in and decision is proposed) */}
                {currentUserId && log.status === 'proposed' && onVote && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onVote(log.id, 'for')}
                      className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full hover:bg-green-200 transition-colors"
                    >
                      👍 Support
                    </button>
                    <button
                      onClick={() => onVote(log.id, 'against')}
                      className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
                    >
                      👎 Oppose
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        {governanceLogs.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-colors">
              View All Decisions →
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
