import React, { useState } from 'react';
import './App.css';
import { auth, db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const questions = [
  { id: 'outdoor', question: 'Do you enjoy outdoor activities?', type: 'boolean' },
  { id: 'foodie', question: 'Do you love trying new restaurants?', type: 'boolean' },
  { id: 'budget', question: 'What is your preferred budget for dates?', type: 'options', options: ['Low', 'Medium', 'High'] },
  { id: 'hobby', question: 'Choose your favorite hobby:', type: 'options', options: ['Cooking', 'Sports', 'Arts', 'Movies', 'Travel'] },
];

function Onboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleAnswer = async (answer) => {
    const updatedAnswers = { ...answers, [questions[currentStep].id]: answer };
    setAnswers(updatedAnswers);

    const user = auth.currentUser;
    if (user) {
      setSaving(true);
      try {
        await setDoc(doc(db, 'userPreferences', user.uid), updatedAnswers);
      } catch (err) {
        console.error('Error saving preferences:', err);
      } finally {
        setSaving(false);
      }
    }

    if (currentStep + 1 < questions.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete && onComplete(updatedAnswers);
      navigate('/dashboard');
    }
  };

  const renderQuestion = () => {
    const q = questions[currentStep];

    if (q.type === 'boolean') {
      return (
        <div className="question-container">
          <p>{q.question}</p>
          <button onClick={() => handleAnswer(true)}>Yes</button>
          <button onClick={() => handleAnswer(false)}>No</button>
        </div>
      );
    }

    if (q.type === 'options') {
      return (
        <div className="question-container">
          <p>{q.question}</p>
          {q.options.map((opt) => (
            <button key={opt} onClick={() => handleAnswer(opt)}>
              {opt}
            </button>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Onboarding</h2>
        <p>Step {currentStep + 1} of {questions.length}</p>
        {saving && <p>Saving your answer...</p>}
        {renderQuestion()}
      </header>
    </div>
  );
}

export default Onboarding;
