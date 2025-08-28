'use client'

import { motion } from 'framer-motion'
import { Shield, Users, TrendingUp, Globe, Target, Gift, ArrowRight } from 'lucide-react'

export default function GovernancePage() {
  const governanceStats = {
    totalDecisions: 212,
    activeHoods: 54,
    studentLeaders: 128,
    communityBoardMembers: 54
  }

  const governanceFlow = [
    {
      step: 1,
      title: 'Student Leadership',
      description: 'Local student leaders gather input and present community needs',
      icon: Users,
      color: 'from-hood-500 to-hood-600'
    },
    {
      step: 2,
      title: 'Neighborhood Representation',
      description: 'Board members advocate for their closest neighborhoods',
      icon: Globe,
      color: 'from-beam-500 to-beam-600'
    },
    {
      step: 3,
      title: 'Community Voting',
      description: 'Hood residents vote directly on priorities and initiatives',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600'
    },
    {
      step: 4,
      title: 'Action & Accountability',
      description: 'Funds and services are unlocked and tracked transparently',
      icon: Shield,
      color: 'from-purple-500 to-purple-600'
    }
  ]

  const recentDecisions = [
    {
      hood: 'Parramore Neighborhood',
      decision: 'Students proposed after-school tutoring with local mentors',
      outcome: 'Approved and funded at $4,000 tier',
      date: '3 days ago'
    },
    {
      hood: 'Lake Eola Heights',
      decision: 'Board member advocated for new senior wellness program',
      outcome: 'Community voted yes – program launches this fall',
      date: '1 week ago'
    },
    {
      hood: 'College Park',
      decision: 'Residents prioritized bike safety workshops led by students',
      outcome: 'Unlocked at $2,500 milestone',
      date: '2 weeks ago'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-hood-500 to-beam-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Governance</h1>
            </div>
            <a href="/" className="text-hood-600 hover:text-hood-700 transition-colors">
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Transparent Community Governance
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Experience student-driven governance where local leaders gather community input, 
            board members represent their neighborhoods, and residents vote directly on priorities.
          </p>
        </motion.div>

        {/* Governance Flow - Moved above stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            How Governance Works
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            {governanceFlow.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center h-full">
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold text-gray-600">
                    {item.step}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
                
                {/* Arrow connector */}
                {index < governanceFlow.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-gray-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Governance Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-4 gap-6 mb-16"
        >
          <div className="bg-gradient-to-br from-hood-50 to-hood-100 p-6 rounded-2xl border border-hood-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-hood-600">Total Decisions</p>
                <p className="text-3xl font-bold text-hood-900">{governanceStats.totalDecisions}</p>
              </div>
              <Shield className="w-8 h-8 text-hood-500" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-beam-50 to-beam-100 p-6 rounded-2xl border border-beam-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-beam-600">Active Hoods</p>
                <p className="text-3xl font-bold text-beam-900">{governanceStats.activeHoods}</p>
              </div>
              <Globe className="w-8 h-8 text-beam-500" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Student Leaders</p>
                <p className="text-3xl font-bold text-green-900">{governanceStats.studentLeaders}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Board Members</p>
                <p className="text-3xl font-bold text-purple-900">{governanceStats.communityBoardMembers}</p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </motion.div>

        {/* Recent Decisions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Recent Community Decisions
          </h3>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="space-y-4">
                {recentDecisions.map((decision, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{decision.hood}</h4>
                      <p className="text-gray-600 text-sm">{decision.decision}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600 mb-1">{decision.outcome}</p>
                      <p className="text-xs text-gray-500">{decision.date}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Transparency Commitment */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-hood-50 to-beam-50 rounded-2xl border border-hood-200 p-8 text-center"
        >
          <Shield className="w-16 h-16 text-hood-600 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Our Commitment to Transparency
          </h3>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
            Every donation, decision, and service delivery is recorded on the blockchain and 
            publicly visible. We believe in complete transparency so communities can see exactly 
            how their contributions are making a difference.
          </p>
          <div className="flex justify-center space-x-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-hood-600">100%</p>
              <p className="text-sm text-gray-600">Donations Tracked</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-beam-600">Real-time</p>
              <p className="text-sm text-gray-600">Updates</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">Public</p>
              <p className="text-sm text-gray-600">Blockchain</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
