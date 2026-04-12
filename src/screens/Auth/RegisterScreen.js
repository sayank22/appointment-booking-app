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
import { Colors } from "../../utils/Colors";
import { showError, showSuccess, showWarning } from "../../utils/feedback";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleRegister = async () => {
    if (loading) return; // ✅ prevent double tap

    try {
      if (!email || !password) {
        return showWarning("Please fill all fields");
      }

      const normalizedEmail = email.trim().toLowerCase();

      if (!isValidEmail(normalizedEmail)) {
        return showWarning("Enter a valid email address");
      }

      if (password.length < 6) {
        return showWarning("Password must be at least 6 characters");
      }

      setLoading(true);

      await register(normalizedEmail, password);

      showSuccess("Verification email sent! Check your inbox.");

      // ✅ Better navigation (prevents going back)
      navigation.replace("Login");

    } catch (err) {
      console.log("REGISTER ERROR:", err);

      if (err.message?.includes("User already registered")) {
        showWarning("This email is already registered. Try logging in.");
      } else {
        showError(err.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AnimatedHeader title="Register to BookIt" />

      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        textContentType="emailAddress"
        returnKeyType="next"
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        textContentType="newPassword"
        returnKeyType="done"
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Registering..." : "Register"}
        </Text>
      </TouchableOpacity>

      <Text
        style={styles.link}
        onPress={() => navigation.navigate("Login")}
      >
        Already have an account? Login here.
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
  link: {
    marginTop: 15,
    color: Colors.primary,
    textAlign: "center",
  },
});