import { createContext, useContext, useEffect, useState } from "react";
import { getData, saveData } from "../services/storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Auto login on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await getData("currentUser");
        if (savedUser) {
          setUser(savedUser);
        }
      } catch (err) {
        console.log("Auth load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // 🔐 Login
  const login = async (userData) => {
    await saveData("currentUser", userData);
    setUser(userData);
  };

  // 🚪 Logout
  const logout = async () => {
    await saveData("currentUser", null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook (clean usage)
export const useAuth = () => useContext(AuthContext);