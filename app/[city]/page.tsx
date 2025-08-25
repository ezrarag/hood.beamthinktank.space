'use client'

import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'

export default function CityPage() {
  const params = useParams()
  const city = params.city as string

  // Mock project data - in real app this would come from your backend
  const projects = [
    {
      id: 1,
      title: 'LumeX',
      tags: ['SaaS', 'Dashboard Design'],
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=face',
      description: 'Modern SaaS dashboard design'
    },
    {
      id: 2,
      title: 'Planza',
      tags: ['Framer Website'],
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
      description: 'Dynamic team collaboration platform'
    },
    {
      id: 3,
      title: 'MotionFlow',
      tags: ['Animation', 'UI/UX'],
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop',
      description: 'Smooth motion design system'
    },
    {
      id: 4,
      title: 'EcoConnect',
      tags: ['Sustainability', 'Mobile App'],
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
      description: 'Environmental impact tracking'
    }
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Header - No border */}
      <header className="px-20 py-8" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-15xl mx-auto">
          <div className="flex justify-between items-center">
            {/* Logo/Title */}
            <div className="flex items-center">
              <h1 className="text-2xl font-light text-gray-900" style={{ fontFamily: 'sans-serif' }}>Neighborhood</h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors font-light text-sm" style={{ fontFamily: 'sans-serif' }}>
                Home
              </a>
              <a href="/governance" className="text-gray-600 hover:text-gray-900 transition-colors font-light text-sm" style={{ fontFamily: 'sans-serif' }}>
                About
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors font-light text-sm" style={{ fontFamily: 'sans-serif' }}>
                Contact
              </a>
            </nav>

            {/* CTA Button */}
            <button className="bg-black hover:bg-gray-800 text-white font-light py-3 px-6 rounded-lg transition-colors duration-200" 
              style={{
                fontFamily: 'sans-serif',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2)',
                transform: 'translateY(0)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4), 0 6px 20px rgba(0, 0, 0, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2)'
              }}
            >
              Build
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Using the Framer CSS template structure */}
      <main 
        className="w-full flex flex-col justify-start items-center px-20 py-16"
        style={{
          boxSizing: 'border-box',
          height: 'min-content',
          padding: '0px 0px 200px 0px',
          overflow: 'hidden',
          alignContent: 'center',
          flexWrap: 'nowrap',
          gap: '0px',
          position: 'relative',
          borderRadius: '0px 0px 0px 0px'
        }}
      >
        {/* City Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-light text-gray-900 mb-4" style={{ fontFamily: 'sans-serif' }}>
            {city.charAt(0).toUpperCase() + city.slice(1)} Projects
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light" style={{ fontFamily: 'sans-serif' }}>
            Discover the latest community projects and initiatives in {city}
          </p>
        </motion.div>

        {/* Projects Grid - 2x2 Layout */}
        <div className="grid grid-cols-2 gap-8 w-full max-w-6xl">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              {/* Project Card - More rounded corners */}
              <div className="relative h-96 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
                style={{ borderRadius: '40px' }}
              >
                {/* Background Image */}
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Enhanced Gradient Overlay with better blur effect */}
                <div className="absolute inset-0" 
                  style={{
                    background: 'linear-gradient(180deg, rgba(0,0,0,0) 5%, rgba(0, 0, 0, 0.47315) 49.949245541838124%, rgba(0,0,0,1) 100%)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)'
                  }}
                ></div>
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {/* Title - Thinner font weight */}
                  <h3 className="text-2xl font-light text-white mb-3" style={{ fontFamily: 'sans-serif' }}>
                    {project.title}
                  </h3>
                  
                  {/* Enhanced Tags - Better styling and positioning */}
                  <div className="flex flex-wrap gap-3">
                    {project.tags.map((tag, tagIndex) => (
                      <span 
                        key={tagIndex}
                        className="px-4 py-2 text-white text-sm rounded-full border border-white/40 font-light"
                        style={{
                          fontFamily: 'sans-serif',
                          backgroundColor: 'rgba(255, 255, 255, 0.15)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}
