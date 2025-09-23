import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Dashboard({ userPreferences: initialPreferences, recommendedDates: initialRecommendations }) {
  const [userPreferences, setUserPreferences] = useState(initialPreferences);
  const [recommendedDates, setRecommendedDates] = useState(initialRecommendations || []);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPreferences = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const prefDoc = await getDoc(doc(db, 'userPreferences', user.uid));
        if (prefDoc.exists()) {
          const prefs = prefDoc.data();
          setUserPreferences(prefs);

          if (!recommendedDates.length) {
            const recommendations = [];
            if (prefs.outdoor) recommendations.push({ title: 'Picnic in the park', description: 'Enjoy a sunny day outside!' });
            if (prefs.foodie) recommendations.push({ title: 'Cooking class', description: 'Try cooking something new together.' });
            if (prefs.hobby === 'Arts') recommendations.push({ title: 'Visit an art gallery', description: 'Explore creativity together.' });
            if (prefs.hobby === 'Movies') recommendations.push({ title: 'Movie night', description: 'Pick a film and relax together.' });
            if (!recommendations.length) recommendations.push({ title: 'Coffee date', description: 'A simple, classic choice!' });
            setRecommendedDates(recommendations);
          }
        }
      } catch (err) {
        console.error('Error fetching preferences:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  if (loading) return <p>Loading your dashboard...</p>;

  return (
    <div className="App">
      <header className="App-header">
        <h2>Welcome to Your Dashboard 💕</h2>
        <button className="logout-btn" onClick={handleLogout}>Log Out</button>

        <div className="preferences-section">
          <h3>Your Preferences</h3>
          {userPreferences ? (
            <ul>
              {Object.entries(userPreferences).map(([key, value]) => (
                <li key={key}><strong>{key}:</strong> {value.toString()}</li>
              ))}
            </ul>
          ) : (
            <p>No preferences found. Please complete onboarding.</p>
          )}
        </div>

        <div className="recommendations-section">
          <h3>Recommended Dates</h3>
          {recommendedDates.length > 0 ? (
            <ul>
              {recommendedDates.map((date, index) => (
                <li key={index}>
                  <strong>{date.title}</strong>: {date.description}
                </li>
              ))}
            </ul>
          ) : (
            <p>No recommendations yet.</p>
          )}
        </div>
      </header>
    </div>
  );
}

export default Dashboard;
