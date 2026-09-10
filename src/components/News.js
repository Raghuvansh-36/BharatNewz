import React, { useCallback, useEffect, useState } from 'react';
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

  const updateNews = useCallback(async () => {
    setProgress(10);
    setError('');
    try {
      setError(null);      
      if (!props.apiKey) {
        throw new Error('API Key is not configured. Please set REACT_APP_NEWS_API environment variable.');
      }

      const url = `https://gnews.io/api/v4/top-headlines?category=${props.category}&country=${props.country}&lang=en&apikey=${props.apiKey}`;
      
      setLoading(true);
      const response = await fetch(url);
      props.setProgress(30);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const parsedData = await response.json();
      props.setProgress(70);
      
      if (parsedData && parsedData.articles) {
        setArticles(parsedData.articles);
        setTotalResults(parsedData.totalResults || 0);
      } else if (parsedData.error) {
        throw new Error(parsedData.error);
      }
      setArticles(parsedData.articles);
      setTotalResults(parsedData.totalArticles || 0);
      setLoading(false);
      setProgress(100);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err.message);
      setLoading(false);
      setProgress(100);
    }
  }, [apiKey, category, country, pageSize, searchQuery, setProgress]);

  useEffect(() => {
    document.title = `BharatNewz - ${regionLabel || capitalizeFirstLetter(props.category)}`;
    updateNews();
    // eslint-disable-next-line
  }, [props.category]);

  const fetchMoreData = async () => {
    const nextPage = page + 1;
    try {
      if (!props.apiKey) {
        throw new Error('API Key is not configured.');
      }

      const url = `https://gnews.io/api/v4/top-headlines?category=${props.category}&country=${props.country}&lang=en&apikey=${props.apiKey}&page=${nextPage}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const parsedData = await response.json();

      if (parsedData && parsedData.articles) {
        setArticles((prevArticles) => prevArticles.concat(parsedData.articles));
        setTotalResults(parsedData.totalArticles || 0);
        setPage(nextPage);
      } else if (parsedData.error) {
        throw new Error(parsedData.error);
      }
    } catch (err) {
      console.error('Error fetching more data:', err);
      setError(err.message);
    }
  };

  return (
    <>
      <div className="page-heading">
        <h1>{regionLabel ? `${regionLabel} News` : `BharatNewz — Top ${capitalizeFirstLetter(props.category)} Headlines`}</h1>
      </div>

      {error && (
        <div className="container mt-3">
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Error:</strong> {error}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setError(null)}
              aria-label="Close"
            ></button>
          </div>
        </div>
      )}

      {loading && page === 1 && (
        <div className="spinner-wrap">
          <Spinner />
        </div>
      )}

      {!error && articles.length > 0 && (
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

      {!loading && !error && articles.length === 0 && (
        <div className="container mt-5">
          <div className="alert alert-info" role="alert">
            No news articles found for this category.
          </div>
        </div>
      )}
    </>
  );
};

News.defaultProps = {
  country: 'in',
  pageSize: 6,
  category: 'general',
  apiKey: 'a0e99a9558597d54c2fc6001cd478a11',
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
  setProgress: PropTypes.func,
  apiKey: PropTypes.string,
};

export default News;
