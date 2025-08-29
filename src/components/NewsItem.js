import React from 'react';

const NewsItem = (props) => {
  const { title, description, imageUrl, newsUrl, date, source } = props;

  return (
    <div className="my-3">
      <div className="card" style={{ position: 'relative', right: '-11px; top: -11px'}}> {/* <-- FIXED: added relative positioning */}
        {/* Badge at the top-right corner */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          position: 'absolute',
          right: '-11px',
          top: '-11px'
        }}>
          <span className="badge rounded-pill bg-danger">
            {source}
          </span>
        </div>

        {/* News Image */}
        <img
          src={imageUrl ? imageUrl : "../assets/no-img.jpg"}
          className="card-img-top"
          alt="news-image"
        />

        {/* News Body */}
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
          <p className="card-text">
            <small className="text-muted">
              Published On {new Date(date).toLocaleString("en-US", {timeZone: 'Asia/Kolkata', month:"long", day:"numeric", year:"numeric", hour:"2-digit", minute:"2-digit"})}
            </small>
          </p>
          <a rel="noreferrer"href={newsUrl}target="_blank"className="btn btn-sm btn-primary">
            Read More
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsItem;

