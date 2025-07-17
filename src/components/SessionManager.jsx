import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

let logoutTimer = null;
let warningTimer = null;

const SessionManager = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(null); // For visual countdown
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const warningDuration = 20 * 1000; // 20 seconds
  const inactivityLimit =  30 * 1000; // 30 seconds   // 1 min =  1 * 60 * 1000

  const resetTimers = useCallback(() => {
    if (!isLoggedIn) return;

    if (logoutTimer) clearTimeout(logoutTimer);
    if (warningTimer) clearTimeout(warningTimer);
    setCountdown(null);

    // Start inactivity timer
    warningTimer = setTimeout(() => {
      let secondsLeft = 20;
      setCountdown(secondsLeft);

      logoutTimer = setInterval(() => {
        secondsLeft -= 1;
        if (secondsLeft <= 0) {
          clearInterval(logoutTimer);
          handleLogout();
        } else {
          setCountdown(secondsLeft);
        }
      }, 1000);
    }, inactivityLimit);
  }, [isLoggedIn]);

  const handleLogout = () => {
    // Clear localStorage and redirect
    localStorage.removeItem("user");
    localStorage.removeItem("token_expiry");
    setCountdown(null);
    setIsLoggedIn(false);
    navigate("/login");
  };

  const activityListener = useCallback(() => {
    if (isLoggedIn) {
    resetTimers();
    }
  }, [resetTimers,isLoggedIn]);

  useEffect(() => {
    // Check login status on mount
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
      resetTimers();  // Initial set
    }
    
    // Activity listeners
    window.addEventListener("mousemove", activityListener);
    window.addEventListener("keydown", activityListener);
    window.addEventListener("click", activityListener);

    return () => {
      window.removeEventListener("mousemove", activityListener);
      window.removeEventListener("keydown", activityListener);
      window.removeEventListener("click", activityListener);
      if (logoutTimer) clearTimeout(logoutTimer);
      if (warningTimer) clearTimeout(warningTimer);
    };
  }, [activityListener, resetTimers]);

  // Render nothing if not logged in
  if (!isLoggedIn) return null;

  return countdown !== null ? (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      background: 'rgba(255,0,0,0.8)',
      color: '#fff',
      padding: '10px 15px',
      borderRadius: '8px',
      zIndex: 9999
    }}>
      Inactivity detected. Logging out in {countdown} sec...
    </div>
  ) : null;
};

export default SessionManager;
