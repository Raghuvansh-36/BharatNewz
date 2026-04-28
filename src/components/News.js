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
  const [error, setError] = useState(false);

  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const updateNews = async () => {
    props.setProgress(10);
    setError(false);
    try {
      const url = `https://gnews.io/api/v4/top-headlines?category=${props.category}&country=${props.country}&lang=en&apikey=${props.apiKey}`;
      setLoading(true);
      const data = await fetch(url);
      props.setProgress(30);
      const parsedData = await data.json();
      props.setProgress(70);
      
      if (parsedData && parsedData.articles) {
        setArticles(parsedData.articles);
        setTotalResults(parsedData.totalResults || 0);
        setError(false);
      } else {
        setError(true);
      }
      setLoading(false);
      props.setProgress(100);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(true);
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
      
      if (parsedData && parsedData.articles) {
        setArticles((prevArticles) => prevArticles.concat(parsedData.articles));
        setTotalResults(parsedData.totalResults || 0);
        setPage(nextPage);
      } else {
        console.warn('Could not fetch more data');
      }
    } catch (err) {
      console.error('Error fetching more data:', err);
    }
  };

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

      {/* Error Message */}
      {error && !loading && (
        <div className="container d-flex justify-content-center">
          <div className="glass-card p-5 text-center" style={{maxWidth: '600px', border: '1px solid rgba(239, 68, 68, 0.3)'}}>
            <h2 style={{color: '#ef4444', marginBottom: '1rem'}}>⚠️ Access Limited</h2>
            <p className="card-text" style={{fontSize: '1.1rem'}}>
              ERROR - due to limited api calls check after some time
            </p>
            <button 
              className="btn-glass mt-3" 
              onClick={updateNews}
              style={{alignSelf: 'center'}}
            >
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
      )}
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
