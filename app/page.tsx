'use client'

import React, { useState } from 'react'

interface Tweet {
  id: string
  text: string
  created_at: string
  imageUrl?: string
  tweetUrl: string
}

function HomePage() {
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')

  const fetchTweets = async () => {
    if (!username.trim()) {
      setError('Please enter a username')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/tweets?username=${encodeURIComponent(username)}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setTweets(data)
    } catch (error) {
      console.error('Error fetching tweets:', error)
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">Recent Tweets</h1>
      <div className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Twitter username"
            className="flex-grow px-4 py-2 border border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
          />
          <button 
            onClick={fetchTweets} 
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Fetch Tweets'}
          </button>
        </div>
      </div>
      {error && <p className="text-red-400 mb-4">Error: {error}</p>}
      {tweets.length > 0 ? (
        <ul className="space-y-6">
          {tweets.map((tweet) => (
            <li key={tweet.id} className="bg-gray-800 shadow-md rounded-lg p-4">
              <p className="mb-2 text-white">{tweet.text}</p>
              {tweet.imageUrl && (
                <img 
                  src={tweet.imageUrl} 
                  alt="Tweet media" 
                  className="w-full h-auto rounded-md mb-2"
                />
              )}
              <div className="flex justify-between items-center text-sm">
                <a 
                  href={tweet.tweetUrl} 
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
      ) : (
        !loading && !error && <p className="text-center text-gray-400">No tweets found.</p>
      )}
    </div>
  )
}

export default HomePage
