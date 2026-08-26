'use client'

import Link from 'next/link'
import { ParticipantProfile } from '@/lib/firebase'
import { BEAM_DIVISIONS } from '@/lib/divisions'
import { Music, Heart, MapPin, ArrowRight, Users, ShieldCheck, Tag } from 'lucide-react'

interface ParticipantCardProps {
  participant: ParticipantProfile
}

export default function ParticipantCard({ participant }: ParticipantCardProps) {
  const balance = participant.hoodVillageBalance || 0
  const encodedEmail = encodeURIComponent(participant.email)
  const isCohort = participant.entityType === 'cohort'

  const divisionInfo = BEAM_DIVISIONS.find(d => d.id === participant.division) || BEAM_DIVISIONS[0]

  return (
    <div className={`bg-slate-900/90 border rounded-3xl p-6 transition-all duration-200 shadow-lg flex flex-col justify-between group ${
      isCohort ? 'border-emerald-500/60 bg-gradient-to-b from-slate-900 via-emerald-950/20 to-slate-900 shadow-emerald-950/20' : 'border-slate-800 hover:border-emerald-500/50'
    }`}>
      <div>
        {/* Top Badges & Balance */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-lg font-bold text-slate-950 shadow-md overflow-hidden flex-shrink-0">
              {participant.headshotUrl ? (
                <img src={participant.headshotUrl} alt={participant.fullName} className="w-full h-full object-cover" />
              ) : (
                isCohort ? <Users className="w-6 h-6 text-slate-950" /> : participant.fullName.substring(0, 2)
              )}
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-md inline-flex items-center">
                {divisionInfo.icon} <span className="ml-1 capitalize">{divisionInfo.name}</span>
              </span>
              {isCohort && (
                <span className="ml-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-md">
                  Institutional Cohort
                </span>
              )}
            </div>
          </div>

          <span className="text-xs font-mono bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-2.5 py-1 rounded-full flex items-center flex-shrink-0">
            <Heart className="w-3 h-3 mr-1 fill-emerald-400" /> ${balance.toLocaleString()} USD
          </span>
        </div>

        {/* Title & Role */}
        <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
          {participant.fullName}
        </h3>
        <p className="text-xs text-slate-300 font-medium mb-2">{participant.primaryRole}</p>

        {/* Location & Specialty */}
        <div className="space-y-1 text-xs text-slate-400 mb-4">
          {participant.primaryInstrument && (
            <p className="flex items-center text-emerald-400">
              <Music className="w-3.5 h-3.5 mr-1.5" /> {participant.primaryInstrument}
            </p>
          )}
          {participant.homeHub && (
            <p className="flex items-center text-slate-400">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> {participant.homeHub}
            </p>
          )}
        </div>

        {/* Tags / Badges */}
        {participant.skillsOrTags && participant.skillsOrTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {participant.skillsOrTags.map((tag, i) => (
              <span key={i} className="text-[10px] bg-slate-950 border border-slate-800/80 text-slate-300 px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Allocation Mini Breakdown */}
        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 mb-4">
          <p className="text-[10px] uppercase font-bold text-slate-500 mb-1.5">Fund Allocations</p>
          <div className="grid grid-cols-4 gap-1 text-[11px] font-mono text-center">
            <div className="bg-blue-950/60 text-blue-400 rounded py-0.5 border border-blue-900/50">
              {participant.hoodAllocations?.travelPercent ?? 40}% Trv
            </div>
            <div className="bg-purple-950/60 text-purple-400 rounded py-0.5 border border-purple-900/50">
              {participant.hoodAllocations?.housingPercent ?? 35}% Hsg
            </div>
            <div className="bg-amber-950/60 text-amber-400 rounded py-0.5 border border-amber-900/50">
              {participant.hoodAllocations?.mealsPercent ?? 15}% Mls
            </div>
            <div className="bg-emerald-950/60 text-emerald-400 rounded py-0.5 border border-emerald-900/50">
              {participant.hoodAllocations?.maintenancePercent ?? 10}% Mnt
            </div>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <Link 
        href={`/participant/${encodedEmail}`}
        className="w-full py-2.5 px-4 bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white font-semibold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all"
      >
        <span>{isCohort ? 'View Cohort & Back Fund' : 'View Profile & Back Participant'}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  )
}
