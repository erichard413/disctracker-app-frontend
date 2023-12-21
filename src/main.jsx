import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuthContext.jsx";
import { UserProvider } from "./hooks/useUserContext.jsx";
import { DiscsProvider } from "./hooks/useDiscContext.jsx";
import { Footer } from "./components/Footer.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DiscsProvider>
          <UserProvider>
            <App />
            <Footer />
          </UserProvider>
        </DiscsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
