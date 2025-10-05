import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar'; // Minimal Navbar for now

// Import pages
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage'; // Main welcome/login page
import DetailsPage from './pages/DetailsPage';
import QuizPage from './pages/QuizPage';
import UploadPage from './pages/UploadPage';
import ResultPage from './pages/ResultPage';

function App() {
  // Determine if we want to show progress bar (currently commented out)
  const showProgressBar = ['/details', '/quiz', '/upload', '/results'].includes(window.location.pathname);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Navbar is minimal; consider adding conditional display for assessment pages */}
        {/* <Navbar /> */}

        {/* ProgressBar removed for now */}
        {/* {showProgressBar && <ProgressBar />} */}

        <main className="flex-grow">
          <Routes>
            {/* Full-page login/signup experience */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Assessment flow */}
            <Route path="/details" element={<DetailsPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/results" element={<ResultPage />} />

            {/* Catch-all redirects to login */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
