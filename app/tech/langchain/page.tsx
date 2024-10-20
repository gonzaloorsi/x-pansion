import React from 'react';
import { createClient } from '@/utils/supabase/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

async function getLatestSummary(technology: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('tweet_summaries')
    .select('*')
    .eq('technology', technology)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching summary:', error);
    return null;
  }

  return data;
}

const LangChainInsightsPage = async () => {
  const technology = 'langchain'; // Changed to 'langchain'
  const summary = await getLatestSummary(technology);

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-400">
        LangChain Insights // Updated title
      </h1>
      
      {summary ? (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-blue-300">Latest LangChain Summary</h2>
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({...props}) => <h1 className="text-3xl font-bold my-4 text-blue-300" {...props} />,
                h2: ({...props}) => <h2 className="text-2xl font-semibold my-3 text-blue-300" {...props} />,
                h3: ({...props}) => <h3 className="text-xl font-semibold my-2 text-blue-300" {...props} />,
                p: ({...props}) => <p className="my-2 text-gray-300" {...props} />,
                ul: ({...props}) => <ul className="list-disc list-inside my-2" {...props} />,
                ol: ({...props}) => <ol className="list-decimal list-inside my-2" {...props} />,
                li: ({...props}) => <li className="my-1 text-gray-300" {...props} />,
                a: ({...props}) => <a className="text-blue-400 hover:underline" {...props} />,
                code: ({inline, children, ...props}: React.PropsWithChildren<{
                  inline?: boolean;
                }>) => 
                  inline 
                    ? <code className="bg-gray-700 text-pink-300 px-1 rounded" {...props}>{children}</code>
                    : <code className="block bg-gray-700 p-2 rounded my-2 text-pink-300" {...props}>{children}</code>,
              }}
            >
              {summary.summary}
            </ReactMarkdown>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            Generated at: {new Date(summary.created_at).toLocaleString()}
          </p>
        </div>
      ) : (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <p className="text-gray-300">No summary available for LangChain.</p>
        </div>
      )}
    </div>
  );
};

export default LangChainInsightsPage; // Updated component name
