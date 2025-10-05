import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const questions = [
  { text: "What is today's exact date (day, month, year)?", points: 5 },
  { text: 'Spell the word "WORLD" backwards.', points: 5 },
  { text: 'Name three common household items.', points: 5 },
  { text: 'Repeat these 3 words clearly: Apple, Table, Penny.', points: 5 },
  { text: 'Count backwards from 50 by 3s (50, 47, 44...).', points: 5 },
  { text: 'What is the current season?', points: 5 },
];

const QuizPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { personalDetails } = location.state || {};
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const mockScore = 22; // Example score out of 30
    console.log('Quiz Score:', mockScore);
    navigate('/upload', { state: { personalDetails, quizScore: mockScore } });
  };

  return (
    <div className="min-h-full flex flex-col items-center p-4 bg-gray-100">
      <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-xl border border-green-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Cognitive Assessment</h2>
        <p className="text-center text-gray-600 mb-8">Answer these questions to assess your cognitive function.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((q, index) => (
            <div key={index} className="bg-green-50 p-5 rounded-lg shadow-sm border border-green-100">
              <label htmlFor={`question-${index}`} className="block text-md font-semibold text-green-800 mb-2">
                {index + 1}. {q.text}
              </label>
              <input 
                type="text" 
                id={`question-${index}`} 
                required 
                className="mt-2 block w-full px-4 py-2 border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Your answer"
              />
            </div>
          ))}
          <div>
            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 ease-in-out">
              Submit Quiz & Proceed to Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizPage;