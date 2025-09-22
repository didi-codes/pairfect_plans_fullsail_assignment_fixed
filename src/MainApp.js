import React, { useState } from 'react';
import Onboarding from './Onboarding';
import Dashboard from './Dashboard';

function MainApp() {
  const [preferences, setPreferences] = useState(null);
  const [recommendedDates, setRecommendedDates] = useState([]);

  const handleOnboardingComplete = (answers) => {
    setPreferences(answers);

    // TEMP: Simple recommendation test model
    const sampleRecommendations = [
      { title: 'Picnic in the park', description: 'Perfect for outdoor lovers!' },
      { title: 'Cooking class', description: 'Try a fun indoor activity together.' },
    ];

    setRecommendedDates(sampleRecommendations);
  };

  return (
    <div>
      {!preferences ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <Dashboard userPreferences={preferences} recommendedDates={recommendedDates} />
      )}
    </div>
  );
}

export default MainApp;
