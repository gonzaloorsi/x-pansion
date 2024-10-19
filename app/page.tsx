'use client'

import React, { useState, useEffect } from 'react'

interface Tweet {
  id: string
  text: string
  created_at: string
}

function HomePage() {
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTweets()
  }, [])

  const fetchTweets = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/tweets?username=nicoalbanese10')
      
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
    <div>
      <h1>Recent Tweets</h1>
      {loading && <p>Loading tweets...</p>}
      {error && <p>Error: {error}</p>}
      {tweets.length > 0 ? (
        <ul>
          {tweets.map((tweet) => (
            <li key={tweet.id}>
              <p>{tweet.text}</p>
              <small>{new Date(tweet.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      ) : (
        !loading && !error && <p>No tweets found.</p>
      )}
    </div>
  )
}

export default HomePage
