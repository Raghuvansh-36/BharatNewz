import React, { useState } from 'react';
import NavBar from './components/NavBar';
import News from './components/News';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import './index.css';

const App = () => {
  const pageSize = 9;
  const apiKey = process.env.REACT_APP_NEWS_API;
  const [progress, setProgress] = useState(0);

  const newsProps = (category) => ({
    setProgress,
    apiKey,
    pageSize,
    country: 'in',
    category,
  });

  return (
    <div>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <NavBar />
        <LoadingBar
          height={3}
          color="linear-gradient(90deg, #4f9eff, #a78bfa)"
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
        />

        <Routes>
          <Route path="/"            element={<News key="general"       {...newsProps('general')}       />} />
          <Route path="/business"    element={<News key="business"      {...newsProps('business')}      />} />
          <Route path="/entertainment" element={<News key="entertainment" {...newsProps('entertainment')} />} />
          <Route path="/health"      element={<News key="health"        {...newsProps('health')}        />} />
          <Route path="/science"     element={<News key="science"       {...newsProps('science')}       />} />
          <Route path="/sports"      element={<News key="sports"        {...newsProps('sports')}        />} />
          <Route path="/technology"  element={<News key="technology"    {...newsProps('technology')}    />} />
          <Route path="*"            element={<News key="fallback"      {...newsProps('general')}       />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
