
/**
 * @author Sai Tanuj Karavadi
 * @date 11/19/2024
*/
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './Profile.css';


const TMDB_API_KEY = '7ceb22d73d90c1567ca77b9aedb51cd8';

const Profile = () => {
  const [sessionId, setSessionId] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [watchlistTVShows, setWatchlistTVShows] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const fetchRequestToken = async () => {
    try {
      const tokenResponse = await fetch(
        `https://api.themoviedb.org/3/authentication/token/new?api_key=${TMDB_API_KEY}`
      );
      const tokenData = await tokenResponse.json();
      if (tokenData.success) {
        document.title = `CyanBase`;
        const requestToken = tokenData.request_token;
        console.log("Request Token:", requestToken);
        redirectToAuthPage(requestToken);  
      } else {
        throw new Error("Failed to generate request token");
      }
    } catch (error) {
      console.error("Error fetching request token:", error);
    }
  };

  const redirectToAuthPage = (requestToken) => {
    const redirectUri = encodeURIComponent("http://localhost:3000/profile");
    const authUrl = `https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=${redirectUri}`;
    window.location.href = authUrl;
  };

  const getValidatedRequestToken = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('request_token');
  };
/*
I HATE SESSION IDS !!!!!!!!!!!!!!!!!
*/
  const createSession = async (validatedRequestToken) => {
    try {
      const sessionResponse = await fetch(
        `https://api.themoviedb.org/3/authentication/session/new?api_key=${TMDB_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ request_token: validatedRequestToken }),
        }
      );
      const sessionData = await sessionResponse.json();
      if (sessionData.success) {
        const sessionId = sessionData.session_id;
        setSessionId(sessionId);
        localStorage.setItem('session_id', sessionId); 
        console.log("Session ID:", sessionId);
      } else {
        throw new Error("Failed to create session");
      }
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  // Fetch the account ID using session ID
  const fetchAccountId = async (sessionId) => {
    try {
      const accountResponse = await fetch(
        `https://api.themoviedb.org/3/account?api_key=${TMDB_API_KEY}&session_id=${sessionId}`
      );
      const accountData = await accountResponse.json();
      if (accountData.id) {
        setAccountId(accountData.id);
        console.log("Account ID:", accountData.id);
      } else {
        throw new Error("Failed to fetch account ID");
      }
    } catch (error) {
      console.error("Error fetching account ID:", error);
    }
  };

  // Fetch watchlist TV shows
  const fetchWatchlistTVShows = async (accountId, sessionId) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/account/${accountId}/watchlist/tv?api_key=${TMDB_API_KEY}&session_id=${sessionId}&language=en-US&sort_by=created_at.asc`
      );
      const data = await response.json();
      if (data.results) {
        setWatchlistTVShows(data.results); 
        console.log("Watchlist TV Shows:", data.results);
      } else {
        throw new Error("Failed to fetch watchlist TV shows");
      }
    } catch (error) {
      console.error("Error fetching watchlist TV shows:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchInput = (e) => {
    setQuery(e.target.value);
  };

  // Perform search and update the state with results
  const handleSearch = async (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${query}&language=en-US`
        );
        const data = await response.json();
        setSearchResults(data.results.filter((show) => show.poster_path));
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }
  };



const handleLogoClick = () => {
  setQuery(''); 
  setSearchResults([]); 
  setWatchlistTVShows([]);
  navigate('/');
};


  useEffect(() => {
    const init = async () => {
      const storedSessionId = localStorage.getItem('session_id');
      if (storedSessionId) {
        setSessionId(storedSessionId);
      } else {
        const validatedRequestToken = getValidatedRequestToken();
        if (validatedRequestToken) {
          await createSession(validatedRequestToken);
        } else {
          fetchRequestToken();  
        }
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (sessionId) {
      fetchAccountId(sessionId);
    }
  }, [sessionId]);

  useEffect(() => {
    if (accountId && sessionId) {
      fetchWatchlistTVShows(accountId, sessionId);
    }
  }, [accountId, sessionId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile">
      {/* Header */}
      <div className="top-bar">
        <div className="logo-container">
          <span onClick={handleLogoClick} className="logo">
            <img
              src="https://images.vexels.com/content/128877/preview/television-flat-icon-48e28d.png"
              alt="logo"
              className="logo-image"
            />
            CyanBase
          </span>
        </div>

        <div className="search-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search..."
            value={query}
            onChange={handleSearchInput}
            onKeyPress={handleSearch}
          />
          <button className="button" type="submit" onClick={handleSearch}>
            <i className="fa fa-search"></i>
          </button>
        </div>

        <div className="profile-container">
          <button className="profile-button" onClick={() => navigate('/profile')}>
            Profile
          </button>
        </div>
      </div>

      {/* Watchlist */}
      <h1>Your Watchlist</h1>
      {watchlistTVShows.length === 0 ? (
        <p>No Shows in your watchlist.</p>
      ) : (
        <ul>
          {watchlistTVShows.map((tvShow) => (
            <li key={tvShow.id}>{tvShow.name}</li>
          ))}
        </ul>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-left">
          &copy; {new Date().getFullYear()} 
          <a href="https://github.com/CyanCheetah" target="_blank" rel="noopener noreferrer">
            Sai Tanuj Karavadi
          </a>
        </div>
        <div className="footer-center">
          Film data from 
          <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="tmdb-link">TMDB</a>
        </div>
        <div className="footer-right">
          <a href="about.html" className="about-link">About</a>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
