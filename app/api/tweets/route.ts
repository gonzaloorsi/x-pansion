import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createClient } from '@/utils/supabase/server';

// Define the hardcoded accounts for each technology
const techAccounts: Record<string, string[]> = {
  nextjs: ['rauchg', 'shadcn', 'vercel'],
  aisdk: ['nicoalbanese10', 'lgrammel', 'jaredpalmer'],
  langchain: ['LangChainAI', 'hwchase17', 'jacobandreas'],
};

// Example tweets for Next.js
const nextjsTweets = [{"edit_history_tweet_ids":["1847287918550831418"],"text":"@Kalpizzy7 @ai doh! when I was copying over the thread I missed that!\nhappy you got it sorted 😊","created_at":"2024-10-18T14:45:35.000Z","id":"1847287918550831418","author_id":"1051829114494177282"},{"edit_history_tweet_ids":["1847258238279954618"],"text":"RT @lgrammel: AI SDK OpenAI Provider 0.0.68\n\n🆕 audio input support w/ gpt-4o-audio-preview\n\nYou can send audio inputs using file content pa…","created_at":"2024-10-18T12:47:39.000Z","id":"1847258238279954618","author_id":"1051829114494177282"},{"edit_history_tweet_ids":["1846826808169120220"],"text":"RT @lgrammel: AI SDK 3.4.13\n\n🆕 access abort signals in tools\n\nYou can access abort signals in tools (with streamText and generateText). Thi…","created_at":"2024-10-17T08:13:18.000Z","id":"1846826808169120220","author_id":"1051829114494177282"},{"edit_history_tweet_ids":["1846650021258973342"],"text":"@joshtriedcoding @Screenstudio I've had similar experience \n\nonly use it for things under 10 min","created_at":"2024-10-16T20:30:48.000Z","id":"1846650021258973342","author_id":"1051829114494177282"},{"edit_history_tweet_ids":["1846548595962421683"],"text":"RT @lgrammel: AI SDK 3.4.11\n\n🆕 useChat setData helper\n\nYou can now clear, transform, and change the stream data that has been sent from the…","created_at":"2024-10-16T13:47:47.000Z","id":"1846548595962421683","author_id":"1051829114494177282"},{"edit_history_tweet_ids":["1846543990801252604"],"text":"@KaundaMarvin yep this would work with hono!","created_at":"2024-10-16T13:29:29.000Z","id":"1846543990801252604","author_id":"1051829114494177282"},{"edit_history_tweet_ids":["1846289014036267376"],"text":"give your AI SDK applications access to the web with @browserbasehq \n\nthis is incredible - can't wait to play around with this https://t.co/cDVFDhOPy7","created_at":"2024-10-15T20:36:17.000Z","id":"1846289014036267376","author_id":"1051829114494177282"},{"edit_history_tweet_ids":["1846244403322802216"],"text":"RT @v0: Introducing v0 Team and Enterprise plans—designed for secure and efficient collaboration.\n\n• Team: Share Projects, chats, and resou…","created_at":"2024-10-15T17:39:01.000Z","id":"1846244403322802216","author_id":"1051829114494177282"},{"edit_history_tweet_ids":["1846244204197859715"],"text":"@theishangoswami happy to help!","created_at":"2024-10-15T17:38:14.000Z","id":"1846244204197859715","author_id":"1051829114494177282"},{"edit_history_tweet_ids":["1846172602433176024"],"text":"AI to explain a SQL query\n\nusing @shadcn tooltips and generateObject from the AI SDK https://t.co/B0TFWi9K4j","created_at":"2024-10-15T12:53:43.000Z","id":"1846172602433176024","author_id":"1051829114494177282"},{"id":"1847554108862972236","created_at":"2024-10-19T08:23:20.000Z","edit_history_tweet_ids":["1847554108862972236"],"author_id":"42241755","text":"RT @pontusab: Considering turning this Bubble menu into a copy-paste component. Let me know if you're interested!\n\n* Shadcn components\n* Ve…"},{"id":"1847544778390466773","created_at":"2024-10-19T07:46:15.000Z","edit_history_tweet_ids":["1847544778390466773"],"author_id":"42241755","text":"@pavelsvitek_ You can build a custom client on top of the stream data protocol:\n\nhttps://t.co/tfE2aQOCgJ\n\nwe are thinking about adding helpers for that as well"},{"id":"1847536955954794909","created_at":"2024-10-19T07:15:10.000Z","edit_history_tweet_ids":["1847536955954794909"],"author_id":"42241755","text":"@paroledunh28672 You can e.g. use Ollama locally https://t.co/XEFNsegvoZ or Chrome AI, or use the OpenAI provider to connect to LM Studio"},{"id":"1847536580224749992","created_at":"2024-10-19T07:13:40.000Z","edit_history_tweet_ids":["1847536580224749992"],"author_id":"42241755","text":"@pavelsvitek_ Depends on your situation. If AI SDK RSC works for you, you may want to stay on it for now. For production, we recommend AI SDK UI, but we plan to resume working on AI SDK RSC at some point.\n\nMore details: https://t.co/LaG9vafedI"},{"id":"1847534784764920104","created_at":"2024-10-19T07:06:32.000Z","edit_history_tweet_ids":["1847534784764920104"],"author_id":"42241755","text":"@pavelsvitek_ Wrote up the appendMessageAnnotation guide. Would that help?\n\nhttps://t.co/o7bA8GRHyo"},{"id":"1847534528664949183","created_at":"2024-10-19T07:05:31.000Z","edit_history_tweet_ids":["1847534528664949183"],"author_id":"42241755","text":"@mrasoahaingo unclear what you mean. can you point me to the issue ticket that you are referring to?"},{"id":"1847534330786009485","created_at":"2024-10-19T07:04:44.000Z","edit_history_tweet_ids":["1847534330786009485"],"author_id":"42241755","text":"@YamCatzenelson you can e.g. use the onStepFinish or onFinish hooks, or even call it inside tools, depending on what you want to achieve"},{"id":"1847533919802933701","created_at":"2024-10-19T07:03:06.000Z","edit_history_tweet_ids":["1847533919802933701"],"author_id":"42241755","text":"@PonziChad Some of the community providers (like Ollama) support local LLMS, or you can use the OpenAI provider to connect to e.g. LM Studio"},{"id":"1847313175038828722","created_at":"2024-10-18T16:25:57.000Z","edit_history_tweet_ids":["1847313175038828722"],"author_id":"42241755","text":"Documentation: https://t.co/V5ZwHuDgQh"},{"id":"1847313039089131697","created_at":"2024-10-18T16:25:24.000Z","edit_history_tweet_ids":["1847313039089131697"],"author_id":"42241755","text":"💡 AI SDK Tip\n\nStreamData message annotations\n\nYou can send data that gets attached to messages in useChat with .appendMessageAnnotation, and retrieve it using the annotations property on a message: https://t.co/nmjOMtSPdT"},{"created_at":"2024-10-19T01:30:17.000Z","id":"1847450163742462402","author_id":"44936471","text":"RT @ctatedev: Drake no: build games with @v0\n\nDrake yes: build GAME ENGINE with v0 to build games\n\n🎃🔊 music by @suno_ai_ https://t.co/p7aEw…","edit_history_tweet_ids":["1847450163742462402"]},{"created_at":"2024-10-18T23:59:06.000Z","id":"1847427216587837604","author_id":"44936471","text":"…. @shadcn releases are a religious experience https://t.co/qZwLvyWG0Q","edit_history_tweet_ids":["1847427216587837604"]},{"created_at":"2024-10-16T15:44:14.000Z","id":"1846577903007625695","author_id":"44936471","text":"@suno_ai_ so dope","edit_history_tweet_ids":["1846577903007625695"]},{"created_at":"2024-10-15T17:34:52.000Z","id":"1846243356852285733","author_id":"44936471","text":"RT @v0: Introducing v0 Team and Enterprise plans—designed for secure and efficient collaboration.\n\n• Team: Share Projects, chats, and resou…","edit_history_tweet_ids":["1846243356852285733"]},{"created_at":"2024-10-13T02:27:13.000Z","id":"1845290164161020264","author_id":"44936471","text":"the @v0 team is coooooooking https://t.co/MOVJp4VPKH","edit_history_tweet_ids":["1845290164161020264"]},{"created_at":"2024-10-10T14:51:39.000Z","id":"1844390341677654430","author_id":"44936471","text":"@fodaisms @rauchg @nextjs @v0 we're are cooking something much more interesting","edit_history_tweet_ids":["1844390341677654430"]},{"created_at":"2024-10-10T13:38:45.000Z","id":"1844371996320403641","author_id":"44936471","text":"@Jacksonmills not yet","edit_history_tweet_ids":["1844371996320403641"]},{"created_at":"2024-10-10T11:39:36.000Z","id":"1844342010301526041","author_id":"44936471","text":"the ai sdk team is cooking https://t.co/kKlG4T0g1T","edit_history_tweet_ids":["1844342010301526041"]},{"created_at":"2024-10-08T18:17:52.000Z","id":"1843717461520335122","author_id":"44936471","text":"RT @damengchen: This UI designer only charges me $20/month 👇\n\nhttps://t.co/BPidFXZQMN https://t.co/5eRurDqaJY","edit_history_tweet_ids":["1843717461520335122"]},{"created_at":"2024-10-08T12:34:30.000Z","id":"1843631050335096855","author_id":"44936471","text":"@jacobmparis also very very hallucination prone for LLMs","edit_history_tweet_ids":["1843631050335096855"]}]

// Example tweets for AI SDK (formerly Vercel AI SDK)
const aisdkTweets = [
  {"edit_history_tweet_ids":["1848500000000000000"],"text":"Excited to announce the latest release of AI SDK! Now with improved streaming capabilities. #AISDK #AIdev","created_at":"2024-10-23T10:00:00.000Z","id":"1848500000000000000","author_id":"1051829114494177282"},
  {"edit_history_tweet_ids":["1848600000000000000"],"text":"Just published a tutorial on integrating ChatGPT with Next.js using AI SDK. Check it out! #AISDK #NextJS","created_at":"2024-10-23T11:00:00.000Z","id":"1848600000000000000","author_id":"1051829114494177282"},
];

// Example tweets for Langchain
const langchainTweets = [
  {"edit_history_tweet_ids":["1848700000000000000"],"text":"New Langchain update: Improved document loaders and enhanced memory management. Perfect for building complex AI apps! #Langchain #AIdev","created_at":"2024-10-24T10:00:00.000Z","id":"1848700000000000000","author_id":"1051829114494177282"},
  {"edit_history_tweet_ids":["1848800000000000000"],"text":"Just released a comprehensive guide on using Langchain for building conversational AI agents. #Langchain #MachineLearning","created_at":"2024-10-24T11:00:00.000Z","id":"1848800000000000000","author_id":"1051829114494177282"},
];

// Combine all tweets into one object for easy access
const technologyTweets: Record<string, typeof nextjsTweets> = {
  nextjs: nextjsTweets,
  aisdk: aisdkTweets,
  langchain: langchainTweets,
};

// Updated mock function to get tweets for a specific technology
const getMockTweets = (technology: string) => {
  return technologyTweets[technology.toLowerCase()] || [];
};

export async function GET(request: Request) {
  const supabase = createClient();

  const { searchParams } = new URL(request.url);
  const technology = searchParams.get('technology');

  if (!technology) {
    return NextResponse.json({ error: 'Technology parameter is required' }, { status: 400 });
  }

  const accounts = techAccounts[technology.toLowerCase()];
  if (!accounts || accounts.length === 0) {
    return NextResponse.json({ error: 'No accounts found for the specified technology' }, { status: 400 });
  }

  try {
    // Use mock data instead of fetching from Twitter API
    const tweets = getMockTweets(technology);

    const summary = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: `You are a coding assistant expert. You are given a list of tweets from a group of developers who are using ${technology}. Your job is to summarize the tweets in a way that is helpful for a code editor to understand what is happening in the community and what is being discussed, and generate code that is up to date with the latest technology. Here are the tweets: ${JSON.stringify(tweets)}`
    });

    // Save summary to Supabase
    const { data, error } = await supabase
      .from('tweet_summaries')
      .insert({
        technology,
        summary: summary.text,
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error('Error saving to Supabase:', error);
      return NextResponse.json({ error: 'Failed to save summary', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ tweets, summary: summary.text, savedSummaryId: data?.[0]?.id });

  } catch (error) {
    console.error('Detailed error:', error);
    let errorMessage = 'An unexpected error occurred';
    let errorDetails = '';

    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || '';
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    return NextResponse.json(
      { 
        error: 'Failed to generate mock data or save summary', 
        message: errorMessage,
        details: errorDetails
      },
      { status: 500 }
    );
  }
}

// Original Twitter API code (commented out for reference)
/*
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
*/
