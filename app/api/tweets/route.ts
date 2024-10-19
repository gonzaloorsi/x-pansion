import { NextResponse } from 'next/server';

const userCache = new Map(); // In-memory cache
const CACHE_LIMIT = 5;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const usernames = searchParams.get('usernames')?.split(',') || [];
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;

  if (usernames.length === 0) {
    return NextResponse.json({ error: 'At least one username is required' }, { status: 400 });
  }

  if (!bearerToken) {
    return NextResponse.json({ error: 'Bearer token not found' }, { status: 500 });
  }

  // Collect cached results
  const cachedResults = [];
  const uncachedUsernames = [];

  usernames.forEach((username) => {
    if (userCache.has(username)) {
      cachedResults.push(...userCache.get(username));
    } else {
      uncachedUsernames.push(username);
    }
  });

  if (uncachedUsernames.length === 0) {
    return NextResponse.json(cachedResults);
  }

  try {
    // Fetch user IDs for all uncached usernames
    const userIds = await Promise.all(
      uncachedUsernames.map(async (username) => {
        const userResponse = await fetch(
          `https://api.twitter.com/2/users/by/username/${username}`,
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`
            }
          }
        );

        if (!userResponse.ok) {
          throw new Error(`API responded with status ${userResponse.status} for user ${username}`);
        }

        const userData = await userResponse.json();
        return { username, id: userData.data.id };
      })
    );

    // Fetch tweets for all user IDs
    const uncachedTweets = await​⬤