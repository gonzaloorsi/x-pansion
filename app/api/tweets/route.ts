import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

// Define the hardcoded accounts for each technology
const techAccounts: Record<string, string[]> = {
  nextjs: ['nicoalbanese10', 'lgrammel', 'jaredpalmer'],
  react: ['reactjs', 'dan_abramov', 'sophiebits'],
  typescript: ['typescript', 'orta', 'RyanCavanaugh'],
  // Add more technologies and their associated accounts as needed
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const technology = searchParams.get('technology');
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;

  if (!technology) {
    return NextResponse.json({ error: 'Technology parameter is required' }, { status: 400 });
  }

  const accounts = techAccounts[technology.toLowerCase()];
  if (!accounts || accounts.length === 0) {
    return NextResponse.json({ error: 'No accounts found for the specified technology' }, { status: 400 });
  }

  if (!bearerToken) {
    return NextResponse.json({ error: 'Bearer token not found' }, { status: 500 });
  }

  try {
    // Fetch user IDs for all accounts
    const userIds = await Promise.all(
      accounts.map(async (username) => {
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
        return { id: userData.data.id, username };
      })
    );

    // Fetch tweets for all user IDs
    const allTweets = await Promise.all(
      userIds.map(async ({ id, username }) => {
        const tweetsResponse = await fetch(
          `https://api.twitter.com/2/users/${id}/tweets?tweet.fields=created_at,author_id&max_results=10`,
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`
            }
          }
        );

        if (!tweetsResponse.ok) {
          throw new Error(`API responded with status ${tweetsResponse.status} for user ${username}`);
        }

        const tweetsData = await tweetsResponse.json();
        return { username, tweets: tweetsData.data };
      })
    );

    const tweets = allTweets.flatMap(({ tweets }) => tweets);
    const summary = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: `You are a coding assistant expert. You are given a list of tweets from a group of developers who are using a particular technology. Your job is to summarize the tweets in a way that is helpful for a code editor to understand what is happening in the community and what is being discussed, and generate code that is up to date with the latest technology. Here are the tweets: ${JSON.stringify(tweets)}`
    })

    console.log(summary.text)

    return NextResponse.json({ summary: summary.text });

  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user information or tweets', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
