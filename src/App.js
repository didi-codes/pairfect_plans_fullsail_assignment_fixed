import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './WelcomePage';
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';
import Onboarding from './Onboarding';
import Dashboard from './Dashboard';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

function App() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [userPreferences, setUserPreferences] = useState(null);
  const [recommendedDates, setRecommendedDates] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const prefDoc = await getDoc(doc(db, 'userPreferences', currentUser.uid));
          if (prefDoc.exists()) {
            const prefs = prefDoc.data();
            setUserPreferences(prefs);

            // Generate TEMP recommendations if ML recommendations not already present
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
          console.error("Error fetching preferences:", err);
        }
      }

      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  if (loadingAuth) return <p>Loading...</p>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signup" element={user ? <Navigate to="/onboarding" /> : <SignupPage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route
          path="/onboarding"
          element={
            user ? (
              userPreferences ? (
                <Navigate to="/dashboard" />
              ) : (
                <Onboarding
                  onComplete={(answers, mlRecommendations = []) => {
                    setUserPreferences(answers);
                    setRecommendedDates(mlRecommendations); // set ML recommendations immediately
                  }}
                />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard userPreferences={userPreferences} recommendedDates={recommendedDates} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;