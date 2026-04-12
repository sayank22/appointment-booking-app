import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import {
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
import { showError, showSuccess, showWarning } from "../../utils/feedback";


WebBrowser.maybeCompleteAuthSession();


export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);

  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        return showWarning("Please fill all fields");
      }

      const normalizedEmail = email.trim().toLowerCase();

      if (!normalizedEmail.includes("@")) {
        return showWarning("Enter valid email");
      }

      setLoading(true);

      await login(normalizedEmail, password);

      showSuccess("Login successful");
    } catch (error) {
      console.log("LOGIN ERROR:", error);

      if (error.message?.includes("Email not confirmed")) {
        showWarning("Verify your email first");
        setShowResend(true);
      } else if (error.message?.includes("Invalid login credentials")) {
        showError("Invalid email or password");
      } else {
        showError(error.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
  try {
    setLoading(true);

    const redirectTo = Linking.createURL("/");

    console.log("Redirect URL:", redirectTo);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;

    const result = await WebBrowser.openAuthSessionAsync(
      data.url,
      redirectTo
    );

    if (result.type === "success" && result.url) {
      // PRO-TIP: Replace the hash with a question mark so Linking.parse guarantees it finds the parameters
      const safeUrl = result.url.replace('#', '?');
      const parsed = Linking.parse(safeUrl);

      if (parsed.queryParams?.access_token) {
        await supabase.auth.setSession({
          access_token: parsed.queryParams.access_token,
          refresh_token: parsed.queryParams.refresh_token,
        });
        // You might want to trigger a success message or navigation here!
      } else {
        showError("Authentication tokens missing");
      }
    }
  } catch (err) {
    console.error("Google login error:", err);
    showError("Google login failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>
      <AnimatedHeader title="Welcome to BookIt" />

      <Text style={styles.title}>Login</Text>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Text style={styles.googleText}>Continue with Google</Text>
      </TouchableOpacity>

      <Text style={{ textAlign: "center", marginVertical: 10, color: "#888" }}>
        OR
      </Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
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
        <Text style={styles.buttonText}>
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      <Text
        style={styles.link}
        onPress={() => navigation.navigate("Register")}
      >
        Don't have an account? Register
      </Text>

      {showResend && (
        <TouchableOpacity style={styles.resendButton}>
          <Text style={styles.resendText}>
            Resend verification email
          </Text>
        </TouchableOpacity>
      )}
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
    textAlign: "center",
    color: Colors.textMain,
  },
  input: {
    backgroundColor: Colors.cardWhite,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 15,
    padding: 12,
    borderRadius: 8,
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
  },
  googleButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  googleText: {
    fontWeight: "600",
  },
  link: {
    marginTop: 15,
    textAlign: "center",
    color: Colors.primary,
  },
  resendButton: {
    marginTop: 12,
    alignItems: "center",
  },
  resendText: {
    color: Colors.primary,
    fontWeight: "600",
  },
});