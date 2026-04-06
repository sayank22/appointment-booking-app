import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AnimatedHeader from "../../components/AnimatedHeader";
import { getData, saveData } from "../../services/storage";
import { Colors } from "../../utils/Colors";
import { showError, showSuccess, showWarning } from "../../utils/feedback";
import { hashPassword } from "../../utils/hash";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

const handleRegister = async () => {
  try {
    if (!email || !password) {
      return showWarning("Please fill all fields");
    }

    setLoading(true);

  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail.includes("@")) {
    setLoading(false);
    return showWarning("Please enter a valid email address");
  }

  let users = await getData("users", []);

  const userExists = users.find((u) => u.email === normalizedEmail);
  if (userExists) {
    setLoading(false);
    return showError("User already exists");
  }

const hashedPassword = hashPassword(password);


  users.push({ email: normalizedEmail, password: hashedPassword });
  await saveData("users", users);

  showSuccess("Registered successfully");
  navigation.navigate("Login");
  } catch {
    showError("Registration failed. Try again.");
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
  onPress={handleRegister}
  disabled={loading}
>
  <Text style={styles.buttonText}>
    {loading ? "Registering..." : "Register"}
  </Text>
</TouchableOpacity>

      <Text
        style={{ marginTop: 15, color: Colors.primary, textAlign: "center" }}
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
});