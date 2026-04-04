import { useState } from "react";
import {
  Alert,
  Button,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { getData, saveData } from "../../services/storage";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      if (Platform.OS === "web") {
  alert("Please enter email and password");
} else {
      Alert.alert("Error", "Please enter email and password");
}
      return;
    }

    const users = await getData("users");

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      if (Platform.OS === "web") {
  alert("Invalid credentials");
} else {
      Alert.alert("Error", "Invalid credentials");
}
      return;
    }

    await saveData("currentUser", user);

    if (Platform.OS === "web") {
  alert("Login successful");
} else {
    Alert.alert("Success", "Login successful");
}
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Login" onPress={handleLogin} />

      <Text
        style={{ marginTop: 15, color: "blue",}}
        onPress={() => navigation.navigate("Register")}
      >
        Don't have an account? Register to Continue.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  justifyContent: "flex-start",
  padding: 20,
  paddingTop: 160,
},
  title: { fontSize: 24, marginBottom: 20 },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
});