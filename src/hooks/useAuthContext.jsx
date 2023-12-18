import { createContext, useContext, useState, useEffect } from "react";
import DiscTrackerAPI from "../api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const token = localStorage.getItem("token") || null;
  const [currentToken, setCurrentToken] = useState(token == null ? "" : token);
  useEffect(() => {
    if (token !== null) {
      localStorage.setItem("token", currentToken);
      DiscTrackerAPI.token = token;
    }
  }, [currentToken]);

  return (
    <AuthContext.Provider value={{ currentToken, setCurrentToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
