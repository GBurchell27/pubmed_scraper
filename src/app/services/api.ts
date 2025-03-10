// API service for communicating with the PubMed Scraper backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface PubMedArticle {
  pmid: string;
  title: string;
  authors: string[];
  journal: string;
  publication_date: string;
  abstract?: string;
  keywords?: string[];
  doi?: string;
}

export interface SearchResponse {
  results: PubMedArticle[];
  total: number;
  page: number;
  limit: number;
}

export async function searchPubMed(query: string, limit: number = 10, page: number = 1): Promise<SearchResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/search?query=${encodeURIComponent(query)}&limit=${limit}&page=${page}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || `Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching PubMed:', error);
    throw error;
  }
}

export async function getArticleDetails(pmid: string): Promise<PubMedArticle> {
  try {
    const response = await fetch(`${API_BASE_URL}/article/${pmid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || `Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching article details:', error);
    throw error;
  }
}

export async function getHealth(): Promise<{ status: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking API health:', error);
    throw error;
  }
} 