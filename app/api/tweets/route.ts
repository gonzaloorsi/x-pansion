import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  if (!bearerToken) {
    return NextResponse.json({ error: 'Bearer token not found' }, { status: 500 });
  }

  try {
    // First, fetch the user ID
    const userResponse = await fetch(
      `https://api.twitter.com/2/users/by/username/${username}`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`
        }
      }
    );

    if (!userResponse.ok) {
      throw new Error(`API responded with status ${userResponse.status}`);
    }

    const userData = await userResponse.json();
    const userId = userData.data.id;

    // Then, fetch the user's tweets
    const tweetsResponse = await fetch(
      `https://api.twitter.com/2/users/${userId}/tweets?tweet.fields=created_at&max_results=10`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`
        }
      }
    );

    if (!tweetsResponse.ok) {
      throw new Error(`API responded with status ${tweetsResponse.status}`);
    }

    const tweetsData = await tweetsResponse.json();
    return NextResponse.json(tweetsData.data);

  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user information', details: error.message },
      { status: 500 }
    );
  }
}
