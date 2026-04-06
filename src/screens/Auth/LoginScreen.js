import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import AnimatedHeader from "../../components/AnimatedHeader";
import { getData, saveData } from "../../services/storage";
import { Colors } from "../../utils/Colors";
import { showError, showSuccess, showWarning } from "../../utils/feedback";
import { hashPassword } from "../../utils/hash";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

const handleLogin = async () => {
  try {
    setLoading(true);
    if (!email || !password) {
      return showWarning("Please enter email and password");
    }

    const users = await getData("users", []);

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail.includes("@")) {
      setLoading(false);
      return showWarning("Please enter a valid email address");
    }

    const hashedPassword = hashPassword(password);

    const user = users.find(
      (u) => u.email === normalizedEmail && u.password === hashedPassword
    );

    if (!user) {
      setLoading(false);
      return showError("Invalid credentials");
    }

    await saveData("currentUser", user);

    showSuccess("Login successful");
    navigation.navigate("Home");
  } catch {
    showError("Login failed. Try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>
      
        <AnimatedHeader title="Welcome in BookIt" />
      
      <Text style={styles.title}>Login</Text>

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
  style={[
    styles.button,
    loading && styles.buttonDisabled
  ]}
  onPress={handleLogin}
  disabled={loading}
>
  <Text style={styles.buttonText}>
    {loading ? "Logging in..." : "Login"}
  </Text>
</TouchableOpacity>

      <Text
        style={{ marginTop: 15, color: Colors.primary, textAlign: "center" }}
        onPress={() => navigation.navigate("Register")}
      >{`Don't have an account? Register to Continue.`}
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