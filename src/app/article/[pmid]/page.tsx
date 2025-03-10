"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getArticleDetails, type PubMedArticle } from '../../services/api';

export default function ArticleDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const pmid = params.pmid as string;
  
  const [article, setArticle] = useState<PubMedArticle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadArticle() {
      if (!pmid) return;
      
      try {
        setLoading(true);
        const data = await getArticleDetails(pmid);
        setArticle(data);
        setError(null);
      } catch (err) {
        setError('Failed to load article: ' + (err instanceof Error ? err.message : String(err)));
        setArticle(null);
      } finally {
        setLoading(false);
      }
    }
    
    loadArticle();
  }, [pmid]);
  
  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24">
      <div className="w-full max-w-4xl">
        <button
          onClick={() => router.back()}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
        >
          ← Back to results
        </button>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        ) : article ? (
          <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold mb-4">{article.title}</h1>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Authors</h2>
              <p>{article.authors?.join(', ') || 'No authors listed'}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Journal Information</h2>
              <p>{article.journal} • {article.publication_date}</p>
              {article.doi && (
                <p className="mt-2">
                  DOI: <a href={`https://doi.org/${article.doi}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{article.doi}</a>
                </p>
              )}
            </div>
            
            {article.abstract && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Abstract</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{article.abstract}</p>
              </div>
            )}
            
            {article.keywords && article.keywords.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Keywords</h2>
                <div className="flex flex-wrap gap-2">
                  {article.keywords.map((keyword, index) => (
                    <span key={index} className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
              <a 
                href={`https://pubmed.ncbi.nlm.nih.gov/${article.pmid}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View on PubMed
              </a>
            </div>
          </article>
        ) : (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <p className="text-yellow-700">Article not found</p>
          </div>
        )}
      </div>
    </main>
  );
} 