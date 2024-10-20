'use client'

import React, { useState } from 'react'
import Link from 'next/link'

const technologies = ['nextjs', 'aisdk', 'langchain']

// New component for technology links
const TechnologyLink = ({ tech }: { tech: string }) => (
  <Link
    href={`/tech/${tech}`}
    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
    tabIndex={0}
    aria-label={`View details for ${tech}`}
  >
    {tech}
  </Link>
)

const HomePage = () => {
  const [summary, setSummary] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [technology, setTechnology] = useState('')

  const handleTechnologyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTechnology(e.target.value)
  }

  const handleFetchSummary = async () => {
    if (!technology) {
      setError('Please select a technology')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/tweets?technology=${encodeURIComponent(technology)}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setSummary(data.summary)
    } catch (error) {
      console.error('Error fetching summary:', error)
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl bg-gray-900">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-400">Technology Tweet Summary</h1>
      
      {/* New section for technology links */}
      <div className="mb-6 flex flex-wrap gap-2 justify-center">
        {technologies.map((tech) => (
          <TechnologyLink key={tech} tech={tech} />
        ))}
      </div>

      <div className="mb-8">
        <div className="flex">
          <select
            value={technology}
            onChange={handleTechnologyChange}
            className="flex-grow px-4 py-2 border border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
          >
            <option value="">Select a technology</option>
            {technologies.map((tech) => (
              <option key={tech} value={tech}>{tech}</option>
            ))}
          </select>
          <button 
            onClick={handleFetchSummary} 
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Fetch Summary'}
          </button>
        </div>
      </div>
      {error && <p className="text-red-400 mb-4">Error: {error}</p>}
      {summary ? (
        <div className="bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-400">Summary for {technology}</h2>
          <div className="text-white space-y-4">
            {summary.split('\n\n').map((paragraph, index) => (
              <p key={index} className="leading-relaxed">
                {paragraph.split('\n').map((line, lineIndex) => (
                  <React.Fragment key={lineIndex}>
                    {line}
                    {lineIndex < paragraph.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </p>
            ))}
          </div>
        </div>
      ) : (
        !loading && !error && <p className="text-center text-gray-400">No summary available. Please fetch a summary.</p>
      )}
    </div>
  )
}

export default HomePage
