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

  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const updateNews = async () => {
    props.setProgress(10);
    try {
      const url = `https://gnews.io/api/v4/top-headlines?category=${props.category}&country=${props.country}&lang=en&apikey=${props.apiKey}`;
      setLoading(true);
      const response = await fetch(url);
      props.setProgress(30);
      const parsedData = await response.json();
      props.setProgress(70);
      
      if (parsedData && parsedData.articles) {
        setArticles(parsedData.articles);
        setTotalResults(parsedData.totalResults || 0);
      }
      setLoading(false);
      props.setProgress(100);
    } catch (err) {
      console.error('Error fetching news:', err);
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
      const url = `https://gnews.io/api/v4/top-headlines?category=${props.category}&country=${props.country}&lang=en&apikey=${props.apiKey}&page=${nextPage}`;
      const response = await fetch(url);
      const parsedData = await response.json();
      
      if (parsedData && parsedData.articles) {
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
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
