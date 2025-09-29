import React, { useEffect, useState } from "react";
import Header from "../components/common/AfterLoginHeader";

function Forlocal() {
  const [localItems, setLocalItems] = useState([]);
  const [cookieItems, setCookieItems] = useState([]);

  // Load all localStorage items
  const loadLocalStorage = () => {
    const allItems = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      allItems.push({ key, value });
    }
    setLocalItems(allItems);
  };

  // Load all cookies
  const loadCookies = () => {
    const cookies = document.cookie.split("; ").filter(Boolean);
    const parsedCookies = cookies.map((cookie) => {
      const [key, ...rest] = cookie.split("=");
      return { key, value: rest.join("=") };
    });
    setCookieItems(parsedCookies);
  };

  useEffect(() => {
    loadLocalStorage();
    loadCookies();
  }, []);

  // Clear all localStorage
  const clearAllLocal = () => {
    localStorage.clear();
    setLocalItems([]);
  };

  // Clear all cookies (set expiry to past date)
  const clearAllCookies = () => {
    const cookies = document.cookie.split("; ").filter(Boolean);
    cookies.forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const key = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = key + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });
    setCookieItems([]);
  };

  return (
    <>
      <Header />
   <div className="max-w-[1440px] p-5 overflow-hidden">
        <h2>LocalStorage Viewer</h2>
        {localItems.length === 0 ? (
          <p>LocalStorage is empty</p>
        ) : (
          <ul className="overflow-hidden">
            {localItems.map((item) => (
              <li key={item.key}>
                <strong>{item.key}</strong>: {item.value}
              </li>
            ))}
          </ul>
        )}
        <button onClick={clearAllLocal} style={{ marginTop: "10px" }}>
          Clear All LocalStorage
        </button>

        <h2 style={{ marginTop: "30px" }}>Cookies Viewer</h2>
        {cookieItems.length === 0 ? (
          <p>No cookies found</p>
        ) : (
          <ul className="overflow-hidden">
            {cookieItems.map((cookie) => (
              <li key={cookie.key}>
                <strong>{cookie.key}</strong>: {cookie.value}
              </li>
            ))}
          </ul>
        )}
        <button onClick={clearAllCookies} style={{ marginTop: "10px" }}>
          Clear All Cookies
        </button>
      </div>
    </>
  );
}

export default Forlocal;
