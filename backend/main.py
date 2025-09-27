import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="PubMed PDF Scraper",
    description="API for scraping and processing PubMed data",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the PubMed PDF Scraper API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/search")
async def search_pubmed(query: str, limit: int = 10, page: int = 1):
    """
    Search for PubMed articles.
    This is a placeholder endpoint that returns mock data.
    In a real application, this would call the PubMed API.
    """
    # Mock data for demonstration
    mock_results = [
        {
            "pmid": "12345678",
            "title": f"Sample article about {query} - 1",
            "authors": ["Smith, John", "Doe, Jane"],
            "journal": "Journal of Medical Research",
            "publication_date": "2023-01-15"
        },
        {
            "pmid": "23456789",
            "title": f"Latest research on {query} - 2",
            "authors": ["Johnson, Robert", "Williams, Emma"],
            "journal": "Medical Science Journal",
            "publication_date": "2023-02-20"
        },
        {
            "pmid": "34567890",
            "title": f"Understanding {query} mechanisms - 3",
            "authors": ["Brown, Michael", "Davis, Sarah"],
            "journal": "Biological Studies",
            "publication_date": "2023-03-10"
        }
    ]
    
    return {
        "results": mock_results,
        "total": len(mock_results),
        "page": page,
        "limit": limit
    }

@app.get("/article/{pmid}")
async def get_article(pmid: str):
    """
    Get details of a specific PubMed article.
    This is a placeholder endpoint that returns mock data.
    In a real application, this would call the PubMed API.
    """
    # Mock data for demonstration
    return {
        "pmid": pmid,
        "title": f"Detailed Article {pmid}",
        "authors": ["Smith, John", "Doe, Jane", "Johnson, Robert"],
        "journal": "Journal of Medical Research",
        "publication_date": "2023-01-15",
        "abstract": "This is a sample abstract for the article. It would contain a summary of the research, methodology, and findings. In a real application, this would be fetched from the PubMed API.",
        "keywords": ["medicine", "research", "biology", "science"],
        "doi": "10.1234/sample.5678"
    }

if __name__ == "__main__":
    import uvicorn
    # Run the application using uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 