// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Pages
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import DetailsPage from './pages/DetailsPage';
import QuizPage from './pages/QuizPage';
import UploadPage from './pages/UploadPage';
import ResultPage from './pages/ResultPage';

function App() {
  return (
    <Router>
      <main className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/details" element={<DetailsPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/results" element={<ResultPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
