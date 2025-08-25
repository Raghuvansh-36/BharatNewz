import React, { useState } from 'react';
import NavBar from './components/NavBar';
import News from './components/News';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';

const App = () => {
  const pageSize = 5;
  const apiKey = process.env.REACT_APP_NEWS_API; // Make sure this is defined in your .env.local file
  const [progress, setProgress] = useState(0);

  return (
    console.log("In Return Outside div")
    <div>
      <Router>
        <NavBar />
        <LoadingBar
          height={3}
          color="red"
          progress={progress}
        />
        console.log("Above route")
        <Routes>
          <Route
            path="*"
            element={<News setProgress={setProgress}apiKey={apiKey}key="general"country="in"category="general"/>}
          />
          <Route
            path="/"
            element={<News setProgress={setProgress}apiKey={apiKey}key="general"country="in"category="general"/>}
          />

          <Route
            path="/business"
            element={<News setProgress={setProgress}apiKey={apiKey}key="business"country="in"category="business"/>}
          />

          <Route
            path="/entertainment"
            element={<News setProgress={setProgress}apiKey={apiKey}key="entertainment"country="in"category="entertainment"/>}
          />

          <Route
            path="/general"
            element={
              <News setProgress={setProgress}apiKey={apiKey}key="general"country="in"category="general"/>}
          />

          <Route
            path="/health"
            element={
              <News setProgress={setProgress}apiKey={apiKey}key="health"country="in"category="health"/>}
          />

          <Route
            path="/science"
            element={
              <News setProgress={setProgress}apiKey={apiKey}key="science"country="in"category="science"/>}
          />

          <Route
            path="/sports"
            element={
              <News setProgress={setProgress}apiKey={apiKey}key="sports"country="in"category="sports"/>}
          />

          <Route
            path="/technology"
            element={<News setProgress={setProgress}apiKey={apiKey}key="technology"country="in"category="technology"/>}
        </Routes>
      </Router>
    </div>
  );
};

export default App;
