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
  // This console.log will run in the *browser* when the app loads.
  // After you deploy, open your live website and check the browser console
  // to make sure the REACT_APP_API_URL is not undefined.
  console.log(
    'App loading. API URL should be:',
    process.env.REACT_APP_API_URL
  );

  return (
    <Router>
      <main className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          {/* Make sure these components exist or you will get build errors */}
          {/* <Route path="/details" element={<DetailsPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/results" element={<ResultPage />} /> */}

          {/* For now, let's just point to / so we know it builds */}
          <Route path="/details" element={<div>Details Page</div>} />
          <Route path="/quiz" element={<div>Quiz Page</div>} />
          <Route path="/upload" element={<div>Upload Page</div>} />
          <Route path="/results" element={<div>Results Page</div>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
