'use client'

import { motion } from 'framer-motion'
import { MapPin, Users, Target, Gift, CheckCircle, Clock, TrendingUp } from 'lucide-react'

interface NodeCardProps {
  node: any
  onJoin: () => void
}

export default function NodeCard({ node, onJoin }: NodeCardProps) {
  // Mock donation tiers for MVP
  const donationTiers = [
    { amount: 500, name: 'Classes', unlocked: true, services: ['Music workshops', 'Art classes', 'Skill sharing'] },
    { amount: 1000, name: 'Cleaning', unlocked: true, services: ['Park maintenance', 'Street cleaning', 'Community gardens'] },
    { amount: 2000, name: 'Food', unlocked: false, services: ['Community meals', 'Food banks', 'Grocery assistance'] },
    { amount: 5000, name: 'Transportation', unlocked: false, services: ['Rideshare program', 'Bike sharing', 'Public transit passes'] }
  ]

  const nextTier = donationTiers.find(tier => !tier.unlocked)
  const progress = (node.currentAmount / node.donationGoal) * 100

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-hood-500 to-beam-500 p-6 text-white">
        <h3 className="text-2xl font-bold mb-2">{node.name}</h3>
        <p className="text-hood-100 flex items-center">
          <MapPin className="w-4 h-4 mr-2" />
          {node.address}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{node.members}</p>
            <p className="text-sm text-gray-600">Members</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-hood-600">${node.currentAmount.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Raised</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-beam-600">${node.donationGoal.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Goal</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress to Next Tier</span>
            <span className="text-sm text-gray-600">
              {nextTier ? `$${nextTier.amount.toLocaleString()}` : 'All tiers unlocked!'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div 
              className="bg-gradient-to-r from-hood-500 to-beam-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            ${node.currentAmount.toLocaleString()} of ${nextTier ? nextTier.amount.toLocaleString() : node.donationGoal.toLocaleString()}
          </p>
        </div>

        {/* Donation Tiers */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 text-hood-500 mr-2" />
            Service Tiers
          </h4>
          <div className="space-y-3">
            {donationTiers.map((tier, index) => (
              <motion.div
                key={tier.amount}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border ${
                  tier.unlocked 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {tier.unlocked ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-400 mr-2" />
                    )}
                    <span className={`font-medium ${
                      tier.unlocked ? 'text-green-700' : 'text-gray-600'
                    }`}>
                      ${tier.amount.toLocaleString()} - {tier.name}
                    </span>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    tier.unlocked 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tier.unlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
                {tier.unlocked && (
                  <div className="ml-7">
                    <p className="text-sm text-green-600 mb-1">Available services:</p>
                    <ul className="text-xs text-green-700 space-y-1">
                      {tier.services.map((service, serviceIndex) => (
                        <li key={serviceIndex} className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2" />
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Current Perks */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Gift className="w-5 h-5 text-beam-500 mr-2" />
            Current Perks
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {node.perks.map((perk: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-beam-50 to-beam-100 p-3 rounded-lg border border-beam-200"
              >
                <p className="text-sm text-beam-700">{perk}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onJoin}
            className="flex-1 bg-hood-600 text-white py-3 px-4 rounded-lg hover:bg-hood-700 transition-colors font-medium"
          >
            Join This Hood
          </button>
          <button className="flex-1 bg-white text-hood-600 py-3 px-4 rounded-lg border border-hood-600 hover:bg-hood-50 transition-colors font-medium">
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  )
}
