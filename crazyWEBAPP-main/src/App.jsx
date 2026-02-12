import React, { useState, useEffect } from 'react';
import Login from "./Login.jsx";
import Dashboard from "./Dashboard.jsx";


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // فقط یک بار هنگام باز شدن سایت چک می‌کند
    const checkExpiry = () => {
      const expiryTime = localStorage.getItem('session_expiry');
      const savedUser = localStorage.getItem('auth_user');

      if (expiryTime && savedUser) {
        const now = new Date().getTime();
        const expiry = new Date(expiryTime).getTime();

        // اگر زمان فعلی کمتر از زمان انقضا بود، لاگین بماند
        if (now < expiry) {
          setUser(savedUser);
          setIsAuthenticated(true);
        } else {
          // اگر وقتش تمام شده بود، پاکسازی کن
          handleLogout();
        }
      }
      setIsLoading(false);
    };

    checkExpiry();
  }, []);

  const handleLoginSuccess = (username, expiry) => {
  // اگر به هر دلیلی تاریخ انقضا از بک‌ند نیامد، خودمان ۳ ساعت اضافه می‌کنیم
  const finalExpiry = expiry || new Date(new Date().getTime() + 3 * 60 * 60 * 1000).toISOString();
  
  localStorage.setItem('session_expiry', finalExpiry);
  localStorage.setItem('auth_user', username);
  
  setUser(username);
  setIsAuthenticated(true); // این خط باعث سوئیچ به داشبورد می‌شود
};
  const handleLogout = async () => {
      await fetch(`http://localhost:5173/api/logout`, {
          method: 'POST',
          credentials: 'include',
        });
      localStorage.removeItem('session_expiry');
      localStorage.removeItem('auth_user');
      setIsAuthenticated(false);
      setUser(null);
        
   
  };

  if (isLoading) return <div className="bg-black min-h-screen"></div>;

  return (
    <div className="min-h-screen bg-black">
      {!isAuthenticated ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Dashboard username={user} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;