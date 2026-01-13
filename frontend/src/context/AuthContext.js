import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // token is a STRING
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  // status is a STRING
  const [status, setStatus] = useState(() => {
    return localStorage.getItem("status") || null;
  });

  // vendor is an OBJECT (safe parse)
  const [vendor, setVendor] = useState(() => {
    try {
      const stored = localStorage.getItem("vendor");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (token, status, vendor) => {
    setToken(token);
    setStatus(status);
    setVendor(vendor);

    localStorage.setItem("token", token);
    localStorage.setItem("status", status);
    localStorage.setItem("vendor", JSON.stringify(vendor));
  };

  const logout = () => {
    setToken(null);
    setStatus(null);
    setVendor(null);

    localStorage.removeItem("token");
    localStorage.removeItem("status");
    localStorage.removeItem("vendor");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        status,
        vendor,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
