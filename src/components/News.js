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
  const [error, setError] = useState(null);

  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const updateNews = async () => {
    props.setProgress(10);
    setError(null);
    try {
      // GNews API for initial headlines
      const url = `https://gnews.io/api/v4/top-headlines?category=${props.category}&country=${props.country}&lang=en&apikey=${props.apiKey}`;
      setLoading(true);
      const response = await fetch(url);
      props.setProgress(30);
      const parsedData = await response.json();
      props.setProgress(70);
      
      if (response.ok && parsedData.articles) {
        setArticles(parsedData.articles);
        setTotalResults(parsedData.totalResults || 0);
        setError(null);
      } else {
        // Capture specific error message from GNews
        setError(parsedData.errors ? parsedData.errors[0] : (parsedData.message || 'Unknown API Error'));
      }
      setLoading(false);
      props.setProgress(100);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to connect to the server. Check your internet connection.');
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
    // Note: GNews free tier has very limited pagination and daily limits.
    // If you need more pages, you'd usually use the 'page' parameter if supported,
    // but often free keys only allow the first 10-20 results.
    const nextPage = page + 1;
    try {
      // Using the same GNews structure for consistency
      const url = `https://gnews.io/api/v4/top-headlines?category=${props.category}&country=${props.country}&lang=en&apikey=${props.apiKey}&page=${nextPage}`;
      const response = await fetch(url);
      const parsedData = await response.json();
      
      if (response.ok && parsedData.articles) {
        setArticles((prevArticles) => prevArticles.concat(parsedData.articles));
        setTotalResults(parsedData.totalResults || 0);
        setPage(nextPage);
      }
    } catch (err) {
      console.error('Error fetching more data:', err);
    }
  };

  return (
    <>
      <div className="page-heading">
        <h1>BharatNewz — Top {capitalizeFirstLetter(props.category)} Headlines</h1>
      </div>

      {loading && page === 1 && (
        <div className="spinner-wrap">
          <Spinner />
        </div>
      )}

      {error && !loading && (
        <div className="container d-flex justify-content-center" style={{marginTop: '2rem'}}>
          <div className="glass-card p-5 text-center" style={{maxWidth: '600px', border: '1px solid rgba(239, 68, 68, 0.3)'}}>
            <h2 style={{color: '#ef4444', marginBottom: '1rem'}}>⚠️ Access Limited</h2>
            <p className="card-text" style={{fontSize: '1rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem'}}>
              {error === 'ERROR - due to limited api calls check after some time' ? error : `Reason: ${error}`}
            </p>
            <p className="card-text" style={{fontSize: '0.9rem'}}>
              ERROR - due to limited api calls check after some time
            </p>
            <button className="btn-glass mt-3" onClick={updateNews} style={{alignSelf: 'center'}}>
              🔄 Try Again
            </button>
          </div>
        </div>
      )}

      {!error && (
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length < totalResults}
          loader={<Spinner />}
        >
          <div className="container">
            <div className="row news-grid">
              {articles.map((element, index) => (
                <div className="col-md-4" key={`${element.url}-${index}`}>
                  <NewsItem
                    title={element.title || ''}
                    description={element.description || ''}
                    imageUrl={element.image}
                    newsUrl={element.url}
                    date={element.publishedAt}
                    source={element.source ? element.source.name : 'Unknown'}
                  />
                </div>
              ))}
            </div>
          </div>
        </InfiniteScroll>
      )}
    </>
  );
};

News.defaultProps = {
  country: 'in',
  pageSize: 6,
  category: 'general',
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
