"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { searchPubMed, type PubMedArticle } from './services/api';

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PubMedArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const data = await searchPubMed(query);
      setResults(data.results || []);
    } catch (err) {
      setError('Error fetching results: ' + (err instanceof Error ? err.message : String(err)));
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const viewArticleDetails = (pmid: string) => {
    router.push(`/article/${pmid}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">PubMed Scraper</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter search terms..."
              className="flex-grow p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
            />
            
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search PubMed'}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
          
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : results.length > 0 ? (
            <ul className="space-y-4">
              {results.map((item, index) => (
                <li key={index} className="border-b pb-3">
                  <h3 className="font-medium text-lg">
                    <button 
                      onClick={() => viewArticleDetails(item.pmid)}
                      className="text-left hover:text-blue-600 focus:outline-none"
                    >
                      {item.title}
                    </button>
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.authors?.join(', ')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.journal} • {item.publication_date}
                  </p>
                  <div className="mt-2 flex space-x-4">
                    <button
                      onClick={() => viewArticleDetails(item.pmid)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View Details
                    </button>
                    <a 
                      href={`https://pubmed.ncbi.nlm.nih.gov/${item.pmid}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View on PubMed
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 p-6">
              {query ? 'No results found. Try a different search term.' : 'Enter a search term to find PubMed articles.'}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
