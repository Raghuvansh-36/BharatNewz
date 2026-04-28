import React, { useEffect, useState } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [apiError, setApiError] = useState(null);

  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const updateNews = async () => {
    props.setProgress(10);
    try {
      const url = `https://gnews.io/api/v4/top-headlines?category=${props.category}&country=${props.country}&lang=en&apikey=${props.apiKey}`;
      setLoading(true);
      const data = await fetch(url);
      props.setProgress(30);
      const parsedData = await data.json();
      props.setProgress(70);

      // Detect API exhaustion: non-2xx status OR missing articles OR error fields in response
      const isExhausted =
        !data.ok ||
        !parsedData.articles ||
        parsedData.errors ||
        parsedData.error ||
        (parsedData.message && !parsedData.articles);

      if (isExhausted) {
        setApiError('ERROR — due to limited API calls, check after some time.');
        setLoading(false);
        props.setProgress(100);
        return;
      }

      setArticles(parsedData.articles);
      setTotalResults(parsedData.totalResults);
      setLoading(false);
      props.setProgress(100);
    } catch (err) {
      console.error('Error fetching news:', err);
      // setApiError('ERROR — due to limited API calls, check after some time.');
      setLoading(false);
      props.setProgress(100);
    }
  };

  useEffect(() => {
    document.title = `BharatNewz - ${capitalizeFirstLetter(props.category)}`;
    updateNews();
    // eslint-disable-next-line
  }, []);

  const fetchMoreData = async () => {
    const nextPage = page + 1;
    try {
      const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&lang=en&category=${props.category}&apiKey=${props.apiKey}&page=${nextPage}&pageSize=${props.pageSize}`;
      const data = await fetch(url);
      const parsedData = await data.json();
      setArticles((prevArticles) => prevArticles.concat(parsedData.articles));
      setTotalResults(parsedData.totalResults);
      setPage(nextPage);
    } catch (error) {
      console.error('Error fetching more data:', error);
    }
  };

  // ── API exhaustion error screen ──
  if (apiError) {
    return (
      <>
        <div className="page-heading">
          <h1>BharatNewz — Top {capitalizeFirstLetter(props.category)} Headlines</h1>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '55vh',
          padding: '2rem',
        }}>
          <div style={{
            background: 'rgba(239, 68, 68, 0.07)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '20px',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 8px 40px rgba(239, 68, 68, 0.15)',
            padding: '3rem 3.5rem',
            textAlign: 'center',
            maxWidth: '560px',
            width: '100%',
          }}>
            {/* Icon */}
            <div style={{ fontSize: '3.5rem', marginBottom: '1.2rem' }}>⚠️</div>

            {/* Heading */}
            <h2 style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              color: '#fca5a5',
              letterSpacing: '0.3px',
              marginBottom: '0.75rem',
            }}>
              API Limit Reached
            </h2>

            {/* Message */}
            <p style={{
              fontSize: '0.92rem',
              color: 'rgba(252, 165, 165, 0.8)',
              lineHeight: 1.65,
              marginBottom: '1.5rem',
            }}>
              ERROR — due to limited API calls, check after some time.
            </p>

            {/* Retry button */}
            <button
              onClick={() => { setApiError(null); updateNews(); }}
              style={{
                padding: '0.5rem 1.4rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#fca5a5',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.22)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.12)'}
            >
              🔄 Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Page heading */}
      <div className="page-heading">
        <h1>BharatNewz — Top {capitalizeFirstLetter(props.category)} Headlines</h1>
      </div>

      {/* Initial spinner */}
      {loading && page === 1 && (
        <div className="spinner-wrap">
          <Spinner />
        </div>
      )}

      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length < totalResults}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row news-grid">
            {articles.map((element) => (
              <div className="col-md-4" key={element.url}>
                <NewsItem
                  title={element.title || ''}
                  description={element.description || ''}
                  imageUrl={element.image}
                  newsUrl={element.url}
                  date={element.publishedAt}
                  source={element.source.name}
                />
              </div>
            ))}
          </div>
        </div>
      </InfiniteScroll>
    </>
  );
};

News.defaultProps = {
  country: 'us',
  pageSize: 6,
  category: 'general',
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
