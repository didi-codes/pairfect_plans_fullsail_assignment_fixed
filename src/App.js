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

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch preferences if they exist
        const prefDoc = await getDoc(doc(db, 'userPreferences', currentUser.uid));
        if (prefDoc.exists()) {
          setUserPreferences(prefDoc.data());

          // TEMP recommendation model
          setRecommendedDates([
            { title: 'Picnic in the park', description: 'Perfect for outdoor lovers!' },
            { title: 'Cooking class', description: 'Try a fun indoor activity together.' },
          ]);
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
        <Route path="/login" element={user ? <Navigate to="/onboarding" /> : <LoginPage />} />
        <Route 
          path="/onboarding" 
          element={
            user ? (
              userPreferences ? <Navigate to="/dashboard" /> : <Onboarding onComplete={(answers) => setUserPreferences(answers)} />
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
