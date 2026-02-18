import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState({
    token: localStorage.getItem("token"),
    user: JSON.parse(localStorage.getItem("user")),
  });

  const setLoginCredentials = (credentials) => {
    setLoggedInUser(credentials);
  };

  const logout = () => {
    localStorage.clear();
    setLoginCredentials(null);
  };

  return (
    <AuthContext.Provider
      value={{
        loggedInUser,
        setLoginCredentials,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
