import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const SessionManager1 = () => {
  const navigate = useNavigate();
  const [warning, setWarning] = useState(false);
  const countdownRef = useRef(null);
  const logoutTimerRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  const INACTIVITY_LIMIT = 1 * 60 * 1000; // 1 minutes
  const WARNING_COUNTDOWN = 20 * 1000; // 20 seconds

  const resetTimers = () => {
    lastActivityRef.current = Date.now();
    setWarning(false);

    if (countdownRef.current) {
      clearTimeout(countdownRef.current);
      countdownRef.current = null;
    }

    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  };

  const logoutUser = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/logout`, {
        withCredentials: true,
      });
    } catch (err) {
      console.error("Logout failed", err);
    }
    localStorage.removeItem("user");
    navigate("/login");
  };

  const startWarningCountdown = () => {
    setWarning(true);

    logoutTimerRef.current = setTimeout(() => {
      logoutUser();
    }, WARNING_COUNTDOWN);
  };

  useEffect(() => {
    const activityHandler = () => {
      const now = Date.now();

      if (now - lastActivityRef.current > INACTIVITY_LIMIT) {
        // Inactivity exceeded 5 mins
        if (!countdownRef.current && !logoutTimerRef.current) {
          startWarningCountdown();
        }
      } else {
        resetTimers();
      }

      lastActivityRef.current = now;
    };

    const interval = setInterval(activityHandler, 1000);

    const events = ["click", "mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimers));

    return () => {
      clearInterval(interval);
      events.forEach((event) => window.removeEventListener(event, resetTimers));
    };
  }, []);

  return (
    <>
      {warning && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-3 rounded shadow-md z-50">
          Session will expire in 20s due to inactivity. Move cursor or press key to stay logged in.
        </div>
      )}
    </>
  );
};

export default SessionManager1;
