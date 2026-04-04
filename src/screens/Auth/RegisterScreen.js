import { useState } from "react";
import { Alert, Button, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { getData, saveData } from "../../services/storage";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!email || !password) {
      if (Platform.OS === "web") {
  alert("Please fill all fields");
} else {
      Alert.alert("Error", "Please fill all fields");
}
      return;
    }

    let users = await getData("users");

    const userExists = users.find((u) => u.email === email);
    if (userExists) {
      if (Platform.OS === "web") {
  alert("User already exists");
} else {
      Alert.alert("Error", "User already exists");
}
      return;
    }

    users.push({ email, password });
    await saveData("users", users);
if (Platform.OS === "web") {
  alert("User already exists");
} else {
    Alert.alert("Success", "Registered successfully");
}
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

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

      <Button title="Register" onPress={handleRegister} />
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