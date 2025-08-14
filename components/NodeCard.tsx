'use client'

import { motion } from 'framer-motion'
import { MapPin, Users, Target, Gift, Calendar, Star, TrendingUp } from 'lucide-react'

interface NodeCardProps {
  node: any
  onJoin: () => void
}

export default function NodeCard({ node, onJoin }: NodeCardProps) {
  const progress = (node.currentAmount / node.donationGoal) * 100
  const unlockedPerks = Math.floor(progress / 25) // Unlock perk every 25%
  
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 60) return 'bg-yellow-500'
    if (progress >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getProgressText = (progress: number) => {
    if (progress >= 80) return 'Almost there!'
    if (progress >= 60) return 'Great progress!'
    if (progress >= 40) return 'Making headway!'
    return 'Getting started!'
  }

  return (
    <div className="card">
      {/* Node Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{node.name}</h3>
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-2 text-hood-500" />
          <span>{node.address}</span>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1 text-hood-500" />
            <span>{node.members} members</span>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1 text-beam-500" />
            <span>Active community</span>
          </div>
        </div>
      </div>

      {/* Donation Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center">
            <Target className="w-5 h-5 mr-2 text-beam-500" />
            Donation Goal
          </h4>
          <span className="text-sm text-gray-600">
            ${node.currentAmount.toLocaleString()} / ${node.donationGoal.toLocaleString()}
          </span>
        </div>
        
        <div className="mb-2">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className={`h-3 rounded-full ${getProgressColor(progress)}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className={`font-medium ${getProgressColor(progress).replace('bg-', 'text-')}`}>
            {getProgressText(progress)}
          </span>
          <span className="text-gray-600">{progress.toFixed(1)}% complete</span>
        </div>
      </div>

      {/* Available Perks */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <Gift className="w-5 h-5 mr-2 text-hood-500" />
          Available Perks ({unlockedPerks}/{node.perks.length})
        </h4>
        
        <div className="space-y-2">
          {node.perks.map((perk: string, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center p-3 rounded-lg border ${
                index < unlockedPerks 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-gray-50 border-gray-200 text-gray-500'
              }`}
            >
              {index < unlockedPerks ? (
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <span className={index < unlockedPerks ? 'font-medium' : ''}>
                {perk}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Milestone Triggers */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-beam-500" />
          Milestone Triggers
        </h4>
        
        <div className="grid grid-cols-3 gap-2 text-center">
          {[25, 50, 75, 100].map((milestone) => (
            <div
              key={milestone}
              className={`p-3 rounded-lg border ${
                progress >= milestone
                  ? 'bg-beam-50 border-beam-200 text-beam-800'
                  : 'bg-gray-50 border-gray-200 text-gray-500'
              }`}
            >
              <div className="text-lg font-bold">{milestone}%</div>
              <div className="text-xs">
                {milestone === 25 && '1st perk'}
                {milestone === 50 && '2nd perk'}
                {milestone === 75 && '3rd perk'}
                {milestone === 100 && 'All perks!'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-hood-500" />
          Recent Activity
        </h4>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span>New member joined</span>
            <span className="text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span>Donation received</span>
            <span className="text-gray-500">1 day ago</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span>Perk unlocked</span>
            <span className="text-gray-500">3 days ago</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={onJoin}
          className="btn-primary flex-1 flex items-center justify-center"
        >
          <Users className="w-4 h-4 mr-2" />
          Join This Node
        </button>
        <button className="btn-secondary flex-1">
          Share
        </button>
      </div>
    </div>
  )
}
