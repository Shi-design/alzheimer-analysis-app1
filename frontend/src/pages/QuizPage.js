import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const questions = [
  { id: 1, text: "What is today's exact date (day, month, year)?", points: 5 },
  { id: 2, text: 'Spell the word "WORLD" backwards.', points: 5 },
  { id: 3, text: 'Name three common household items.', points: 5 },
  { id: 4, text: 'Repeat these 3 words clearly: Apple, Table, Penny.', points: 5 },
  { id: 5, text: 'Count backwards from 50 by 3s (50, 47, 44...).', points: 5 },
  { id: 6, text: 'What is the current season?', points: 5 },
];

const QuizPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { personalDetails } = location.state || {};
  const [answers, setAnswers] = useState({});

  const handleChange = (id, value) => {
    setAnswers({ ...answers, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic logic — 1 point for each answered question
    let total = 0, correct = 0;
    questions.forEach((q) => {
      total += q.points;
      if (answers[q.id] && answers[q.id].trim().length > 0) correct += q.points;
    });

    const percent = Math.round((correct / total) * 100);
    console.log("🧠 Cognitive Quiz Score:", percent);

    // Pass to UploadPage
    navigate('/upload', { state: { personalDetails, quizScore: percent } });
  };

  return (
    <div className="min-h-full flex flex-col items-center p-4 bg-gray-100">
      <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-xl border border-green-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Cognitive Assessment</h2>
        <p className="text-center text-gray-600 mb-8">Answer these questions to assess your cognitive function.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((q) => (
            <div key={q.id} className="bg-green-50 p-5 rounded-lg shadow-sm border border-green-100">
              <label className="block text-md font-semibold text-green-800 mb-2">
                {q.id}. {q.text}
              </label>
              <input
                type="text"
                required
                value={answers[q.id] || ''}
                onChange={(e) => handleChange(q.id, e.target.value)}
                className="mt-2 block w-full px-4 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500"
                placeholder="Your answer"
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full py-3 rounded-md text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition"
          >
            Submit Quiz & Proceed to Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuizPage;
