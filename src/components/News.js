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
  const [error, setError] = useState('');
  const { apiKey, category, country, pageSize, setProgress, regionLabel, searchQuery } = props;

  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const updateNews = useCallback(async () => {
    setProgress(10);
    setError('');
    try {
      const endpoint = searchQuery ? 'search' : 'top-headlines';
      const params = new URLSearchParams({ category, lang: 'en', max: pageSize, apikey: apiKey });
      if (country) params.set('country', country);
      if (searchQuery) params.set('q', searchQuery);
      const targetUrl = `https://gnews.io/api/v4/${endpoint}?${params.toString()}`;

      setLoading(true);
      const response = await fetch(targetUrl);
      setProgress(30);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const parsedData = await response.json();
      setProgress(70);

      if (!parsedData.articles) {
        throw new Error(parsedData.errors?.[0] || parsedData.message || 'The API returned no articles.');
      }
      setArticles(parsedData.articles);
      setTotalResults(parsedData.totalArticles || 0);
      setLoading(false);
      setProgress(100);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err.message || 'Unable to load news right now.');
      setLoading(false);
      setProgress(100);
    }
  }, [apiKey, category, country, pageSize, searchQuery, setProgress]);

  useEffect(() => {
    document.title = `BharatNewz - ${regionLabel || capitalizeFirstLetter(props.category)}`;
    updateNews();
  }, [props.category, regionLabel, updateNews]);

  const fetchMoreData = async () => {
    const nextPage = page + 1;
    try {
      const endpoint = searchQuery ? 'search' : 'top-headlines';
      const params = new URLSearchParams({
        category: props.category,
        lang: 'en',
        max: props.pageSize,
        apikey: props.apiKey,
        page: nextPage,
      });
      if (props.country) params.set('country', props.country);
      if (searchQuery) params.set('q', searchQuery);
      const targetUrl = `https://gnews.io/api/v4/${endpoint}?${params.toString()}`;

      const response = await fetch(targetUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const parsedData = await response.json();

      if (parsedData && parsedData.articles) {
        setArticles((prevArticles) => prevArticles.concat(parsedData.articles));
        setTotalResults(parsedData.totalArticles || 0);
        setPage(nextPage);
      }
    } catch (err) {
      console.error('Error fetching more data:', err);
    }
  };

  return (
    <>
      <div className="page-heading">
        <h1>{regionLabel ? `${regionLabel} News` : `BharatNewz — Top ${capitalizeFirstLetter(props.category)} Headlines`}</h1>
      </div>

      {loading && page === 1 && (
        <div className="spinner-wrap">
          <Spinner />
        </div>
      )}

      {error && <p className="news-error">{error}</p>}

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
  regionLabel: PropTypes.string,
  searchQuery: PropTypes.string,
};

export default News;
