import React from 'react';

const NewsItem = (props) => {
  const { title, description, imageUrl, newsUrl, date, source } = props;

  const formattedDate = new Date(date).toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="glass-card">
      {/* Source badge */}
      <span className="source-badge" title={source}>{source}</span>

      {/* Image */}
      <div className="card-img-wrap">
        <img
          src={imageUrl || 'https://placehold.co/600x300/0d1f3c/4f9eff?text=BharatNewz'}
          alt="news"
          onError={(e) => {
            e.target.src = 'https://placehold.co/600x300/0d1f3c/4f9eff?text=BharatNewz';
          }}
        />
      </div>

      {/* Body */}
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}</p>
        <p className="card-date">🕐 {formattedDate} IST</p>
        <a
          rel="noreferrer"
          href={newsUrl}
          target="_blank"
          className="btn-glass"
        >
          Read More →
        </a>
      </div>
    </div>
  );
};

export default NewsItem;
