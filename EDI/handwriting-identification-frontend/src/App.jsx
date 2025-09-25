import React, { useState } from "react";
import { GlobalStyle } from "./styles/globalStyles.js";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogin = (username) => {
    setUsername(username);
    setLoggedIn(true);
  };

  return (
    <>
      <GlobalStyle />
      {loggedIn ? (
        <Dashboard username={username} onLogout={() => setLoggedIn(false)} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  );
};

export default App;
