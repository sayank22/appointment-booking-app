import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import AnimatedHeader from "../../components/AnimatedHeader";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../services/supabase";
import { Colors } from "../../utils/Colors";
import { showError, showWarning } from "../../utils/feedback";

// Required for web browser flow
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Pulling both login methods from context
  const { login, loginWithGoogle } = useAuth();

  // ✅ Supabase Email login with custom UI feedback
  const handleLogin = async () => {
    try {
      if (!email || !password) {
        return showWarning("Please enter email and password");
      }

      setLoading(true);
      
      // Using Supabase instead of local storage mock data
      await login(email.trim().toLowerCase(), password);
      
      // Note: No need for showSuccess here, AuthContext automatically routes to Home!
    } catch (error) {
      showError(error.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google login with working PKCE logic
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const data = await loginWithGoogle();

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          data.redirectTo 
        );

        console.log("Browser Result:", result);

        if (result.type === "success" && result.url) {
          // EXCTRACT THE CODE FROM THE URL
          const parsedUrl = Linking.parse(result.url);
          const authCode = parsedUrl.queryParams?.code;

          if (authCode) {
            // Send ONLY the code to Supabase
            const { error } = await supabase.auth.exchangeCodeForSession(authCode);
            
            // Ignore the double-fire errors
            if (
              error && 
              !error.message.includes("Invalid login credentials") &&
              !error.message.includes("flow state")
            ) {
              console.error("Exchange Error:", error.message);
              showError("Login failed during security check.");
            }
          } else {
            console.error("No code found in the returned URL");
            showError("No authentication code found.");
          }
        }
      }
    } catch (err) {
      console.error("Google login error:", err);
      showError("Failed to log in with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AnimatedHeader title="Welcome to BookIt" />
      
      <Text style={styles.title}>Login</Text>

      {/* Google Login Button */}
      <TouchableOpacity
        style={[styles.button, styles.googleButton, loading && styles.buttonDisabled]}
        onPress={handleGoogleLogin}
        disabled={loading}
      >
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.divider} />
      </View>

      {/* Standard Email Login */}
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={Colors.textWhite || "#fff"} />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <Text
        style={{ marginTop: 15, color: Colors.primary, textAlign: "center" }}
        onPress={() => navigation.navigate("Register")}
      >
        {`Don't have an account? Register to Continue.`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", 
    padding: 20,
    backgroundColor: Colors.background, 
  },
  title: { 
    fontSize: 28,
    fontWeight: "bold", 
    marginBottom: 30,
    color: Colors.textMain,
    textAlign: "center",
  },
  input: {
    backgroundColor: Colors.cardWhite,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 15,
    padding: 12,
    borderRadius: 8,
    color: Colors.textMain,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: Colors.buttonDisabled, 
  },
  buttonText: {
    color: Colors.textWhite,
    fontWeight: "bold",
    fontSize: 16,
  },
  googleButton: {
    backgroundColor: Colors.cardWhite,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  googleButtonText: {
    color: Colors.textMain,
    fontSize: 16,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: 10,
    color: Colors.textMain,
    fontWeight: "bold",
  },
});