import { motion } from 'framer-motion'

interface AllocationBreakdownCardProps {
  allocationBreakdown: {
    education: number
    healthcare: number
    environment: number
    infrastructure: number
    community_services: number
  }
}

export default function AllocationBreakdownCard({ allocationBreakdown }: AllocationBreakdownCardProps) {
  const categories = [
    { key: 'education', label: 'Education', icon: '🎓', color: 'from-blue-500 to-blue-600' },
    { key: 'healthcare', label: 'Healthcare', icon: '🏥', color: 'from-green-500 to-green-600' },
    { key: 'environment', label: 'Environment', icon: '🌱', color: 'from-emerald-500 to-emerald-600' },
    { key: 'infrastructure', label: 'Infrastructure', icon: '🏗️', color: 'from-orange-500 to-orange-600' },
    { key: 'community_services', label: 'Community', icon: '🤝', color: 'from-purple-500 to-purple-600' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <h4 className="text-lg font-semibold text-gray-900 mb-6">Allocation Breakdown</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {categories.map((category) => {
          const percentage = allocationBreakdown[category.key as keyof typeof allocationBreakdown]
          return (
            <motion.div
              key={category.key}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-center group hover:scale-105 transition-transform"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-full mx-auto mb-2 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                <span className="text-white font-bold text-lg">{percentage}%</span>
              </div>
              <div className="text-2xl mb-1">{category.icon}</div>
              <p className="text-sm text-gray-600 font-medium capitalize">
                {category.label.replace('_', ' ')}
              </p>
              
              {/* Progress bar */}
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-1.5 rounded-full bg-gradient-to-r ${category.color}`}
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Allocated</span>
          <span className="text-lg font-bold text-gray-900">
            {Object.values(allocationBreakdown).reduce((sum, val) => sum + val, 0)}%
          </span>
        </div>
      </div>
    </motion.div>
  )
}
