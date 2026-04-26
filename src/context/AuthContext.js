import * as Linking from "expo-linking";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Initialize session + listen for auth changes
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        console.log("Initial session:", session);

        setUser(session?.user ?? null);
      } catch (err) {
        console.error("Auth init error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("AUTH EVENT:", event);
        console.log("AUTH CHANGE:", session);

        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🔥 NOTE: The handleDeepLink useEffect has been COMPLETELY REMOVED from here!
  // LoginScreen.js handles the code exchange now, eliminating the race condition.

  // ✅ Email login
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  // ✅ Register (with email redirect)
  const register = async (email, password) => {
    const redirectTo = Linking.createURL("/");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo, // 🔥 IMPORTANT
      },
    });

    if (error) throw error;
    return data;
  };

  // ✅ Google OAuth Login
  const loginWithGoogle = async () => {
    // 🔥 BRUTE FORCE: Hardcoding your exact Expo Go local IP URL
    const redirectTo = "exp://192.168.29.208:8081"; 
    
    console.log("👉 FORCING REDIRECT TO:", redirectTo);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) throw error;
    
    return { ...data, redirectTo }; 
  };

  // ✅ Logout
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginWithGoogle, // 👈 Exported for your UI components
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);