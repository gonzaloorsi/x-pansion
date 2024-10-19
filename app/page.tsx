'use client'

import React, { useState } from 'react'

interface Tweet {
  id: string
  text: string
  created_at: string
  author_id: string
}

interface UserTweets {
  username: string
  tweets: Tweet[]
}

const technologies = ['nextjs', 'react', 'typescript'] // Add more as needed

const HomePage = () => {
  const [userTweets, setUserTweets] = useState<UserTweets[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [technology, setTechnology] = useState('')

  const handleTechnologyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTechnology(e.target.value)
  }

  const handleFetchTweets = async () => {
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
      setUserTweets(data)
    } catch (error) {
      console.error('Error fetching tweets:', error)
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">Recent Tweets by Technology</h1>
      <div className="mb-6">
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
            onClick={handleFetchTweets} 
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Fetch Tweets'}
          </button>
        </div>
      </div>
      {error && <p className="text-red-400 mb-4">Error: {error}</p>}
      {userTweets.length > 0 ? (
        <div className="space-y-8">
          {userTweets.map((userTweet) => (
            <div key={userTweet.username} className="bg-gray-800 shadow-md rounded-lg p-4">
              <h2 className="text-xl font-bold mb-4 text-blue-400">@{userTweet.username}</h2>
              <ul className="space-y-4">
                {userTweet.tweets.map((tweet) => (
                  <li key={tweet.id} className="border-t border-gray-700 pt-4">
                    <p className="mb-2 text-white">{tweet.text}</p>
                    <div className="flex justify-between items-center text-sm">
                      <a 
                        href={`https://twitter.com/${userTweet.username}/status/${tweet.id}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        View on Twitter
                      </a>
                      <span className="text-gray-400">{new Date(tweet.created_at).toLocaleString()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        !loading && !error && <p className="text-center text-gray-400">No tweets found.</p>
      )}
    </div>
  )
}

export default HomePage
