import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = 'http://localhost:5000';

function App() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadBusinesses = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/businesses`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setBusinesses(data);
      }
    } catch (err) {
      setError('Failed to load businesses. Make sure Flask server is running.');
    } finally {
      setLoading(false);
    }
  };

  const rateRestaurant = async (businessId, rating) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          business_id: businessId,
          rating: parseInt(rating)
        })
      });
      
      const data = await response.json();
      if (data.success) {
        alert('Rating submitted successfully!');
      }
    } catch (err) {
      alert('Error submitting rating');
      console.error('Error:', err);
    }
  };

  const StarRating = ({ stars }) => {
    const fullStars = Math.floor(stars);
    const hasHalfStar = stars % 1 !== 0;
    
    return (
      <span className="stars">
        {'★'.repeat(fullStars)}
        {hasHalfStar && '☆'}
        {'☆'.repeat(5 - Math.ceil(stars))}
      </span>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🍽️ Yelp Restaurant Rating App</h1>
        <p>Discover and rate restaurants from real Yelp data!</p>
        
        <div className="button-container">
          <button 
            className="load-btn"
            onClick={loadBusinesses}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load Restaurants'}
          </button>
        </div>

        {error && (
          <div className="error">
            <p>❌ {error}</p>
            <p>Make sure your Flask server is running on http://localhost:5000</p>
          </div>
        )}

        {businesses.length > 0 && (
          <div className="businesses-container">
            <h2>🏪 Found {businesses.length} Restaurants</h2>
            <div className="businesses-grid">
              {businesses.map((business) => (
                <div key={business.business_id} className="business-card">
                  <h3>{business.name}</h3>
                  
                  <div className="business-info">
                    <p><strong>📍 Location:</strong> {business.city}, {business.state}</p>
                    <p>
                      <strong>⭐ Rating:</strong> 
                      <StarRating stars={business.stars} /> 
                      ({business.stars}/5)
                    </p>
                    <p><strong>📝 Reviews:</strong> {business.review_count}</p>
                  </div>

                  <div className="rating-section">
                    <label><strong>Rate this restaurant:</strong></label>
                    <select 
                      onChange={(e) => {
                        if (e.target.value) {
                          rateRestaurant(business.business_id, e.target.value);
                          e.target.value = ''; // Reset dropdown
                        }
                      }}
                      className="rating-select"
                    >
                      <option value="">Select rating...</option>
                      <option value="1">⭐ 1 Star</option>
                      <option value="2">⭐⭐ 2 Stars</option>
                      <option value="3">⭐⭐⭐ 3 Stars</option>
                      <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                      <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
