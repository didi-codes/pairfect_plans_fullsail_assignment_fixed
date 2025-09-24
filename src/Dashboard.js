import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import logo from "./Pairfect_Plans_Logo.png";
import profile_img from "./profile_image.jpg"
import './App.css';

function Dashboard({ userPreferences: initialPreferences, recommendedDates: initialRecommendations }) {
  const [userPreferences, setUserPreferences] = useState(initialPreferences || {});
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
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  if (loading) return <p>Loading your dashboard...</p>;

  // categories for grouping preferences
  const preferenceCategories = {
    Outdoors: ["Hiking/Nature Trails", "Park/Picnics", "Camping/Glamping"],
    "Dining/Food": ["Coffee", "Boba", "Tacos"],
    "Entertainment & Events": ["Concerts/Live Music", "Comedy Show/Improv", "Trivia Nights/Board Games"],
    "At Home": ["Movie Night", "Spa Night", "Game Night"],
    Falltivities: ["Apple Picking", "Pumpkin Picking", "Haunted House"],
  };

  return (
    <div className="App">

      {/* ===== Header ===== */}
      <div className="dashboard-header">
        <div className="left">
          <img src={logo} alt="logo" className="logo"  id='dashboard-logo'/>
          <span className="username">{auth.currentUser?.displayName || "Damaris Garcia"}</span>
        </div>
        <img src={profile_img} alt="profile" className="profile-pic" />
      </div>

       {/* ===== Recommendations Section ===== */}
      <h3 className="section-title" id='recommended-dates-title'>Recommended Dates</h3>
      {recommendedDates.length > 0 ? (
        <div className="pill-container" id='recommended-dates'>
          {recommendedDates.map((date, index) => (
            <div className="pill" key={index}>
              <strong>{date.title}</strong>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-text">No recommendations yet.</p>
      )}

      {/* ===== Preferences Section (grouped by category) ===== */}
      {Object.entries(preferenceCategories).map(([category, items]) => (
        <div key={category} className="category-section">
          <h3 className="section-title">{category}</h3>
          <div className="pill-container">
            {items.map((item, idx) => (
              <div
                key={idx}
                className={`pill ${userPreferences[item] ? "active" : ""}`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* ===== Bottom Navigation ===== */}
      <div className="bottom-nav">
        <div className="nav-icon active">🏠</div>
        <div className="nav-icon">❤️</div>
        <div className="nav-icon">🔔</div>
        <button className="logout-btn" onClick={handleLogout}>Log Out</button>
      </div>
    </div>
  );
}

export default Dashboard;