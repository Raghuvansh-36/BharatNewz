// API client for BharatNewz backend (FastAPI + PostgreSQL)
// All data is dynamically fetched from the PostgreSQL database & live RSS scraper without hard-coding.

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

export async function fetchNewsArticles(params = {}) {
  try {
    const url = new URL(`${API_BASE_URL}/news`);
    if (params.country_code) url.searchParams.append("country_code", params.country_code);
    if (params.category && params.category !== "All") url.searchParams.append("category", params.category);
    if (params.threat_level && params.threat_level !== "All") url.searchParams.append("threat_level", params.threat_level);
    if (params.search) url.searchParams.append("search", params.search);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("[API] Error fetching news from PostgreSQL backend:", err.message);
    return [];
  }
}

export async function fetchThreatHighlights(countryCode = null) {
  try {
    const url = new URL(`${API_BASE_URL}/threats`);
    if (countryCode) url.searchParams.append("country_code", countryCode);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("[API] Error fetching threats from PostgreSQL backend:", err.message);
    return [];
  }
}

export async function fetchCountrySummaries() {
  try {
    const res = await fetch(`${API_BASE_URL}/countries/summary`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("[API] Error fetching summaries from PostgreSQL backend:", err.message);
    return [];
  }
}

export async function triggerNewsScrape() {
  try {
    const res = await fetch(`${API_BASE_URL}/news/scrape`, { method: "POST" });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("[API] Failed to trigger live news scrape:", err.message);
    return { status: "error", message: err.message, new_articles_count: 0 };
  }
}

export async function createNewsArticle(articleData) {
  const res = await fetch(`${API_BASE_URL}/news`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(articleData)
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return await res.json();
}
