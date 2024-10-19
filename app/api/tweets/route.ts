import { NextResponse } from 'next/server';

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

  try {
    // Fetch user IDs for all usernames
    const userIds = await Promise.all(
      usernames.map(async (username) => {
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
        return userData.data.id;
      })
    );

    // Fetch tweets for all user IDs
    const allTweets = await Promise.all(
      userIds.map(async (userId) => {
        const tweetsResponse = await fetch(
          `https://api.twitter.com/2/users/${userId}/tweets?tweet.fields=created_at,author_id&max_results=10`,
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`
            }
          }
        );

        if (!tweetsResponse.ok) {
          throw new Error(`API responded with status ${tweetsResponse.status} for user ID ${userId}`);
        }

        const tweetsData = await tweetsResponse.json();
        return tweetsData.data;
      })
    );

    // Combine all tweets into a single array
    const combinedTweets = allTweets.flat();

    return NextResponse.json(combinedTweets);

  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user information or tweets', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
