import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Pages
import LoginPage from './pages/LoginPage'; // This is your new name entry page
import DetailsPage from './pages/DetailsPage';
import QuizPage from './pages/QuizPage';
import UploadPage from './pages/UploadPage';
import ResultPage from './pages/ResultPage';
// We have removed SignupPage

function App() {
  return (
    <Router>
      <main className="min-h-screen flex flex-col">
        <Routes>
          {/* LoginPage (name entry) is now the home page */}
          <Route path="/" element={<LoginPage />} />
          
          {/* Signup route is gone */}
          
          {/* The rest of your app flow */}
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
