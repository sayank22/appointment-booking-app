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
import { Colors } from "../../utils/Colors";
import { showError, showSuccess, showWarning } from "../../utils/feedback";

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleRegister = async () => {
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

      // ✅ Replace so user can’t go back to register
      navigation.replace("Login");
    } catch (err) {
      console.log("REGISTER ERROR:", err);

      if (err.message?.includes("User already registered")) {
        showError("Email already registered. Try logging in.");
      } else {
        showError(err.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      
      <AnimatedHeader title="Welcome to BookIt" />

      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity
        style={[
          styles.button,
          loading && styles.buttonDisabled
        ]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={Colors.textWhite || "#fff"} />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>

      <Text
        style={{ marginTop: 15, color: Colors.primary, textAlign: "center" }}
        onPress={() => navigation.navigate("Login")}
      >
        Already have an account? Login
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
});