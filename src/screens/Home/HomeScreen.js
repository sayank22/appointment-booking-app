import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { providers } from "../../data/providers";
import { saveData } from "../../services/storage";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Service Providers</Text>

      {/* 🔥 View Appointments Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Appointments")}
        style={styles.appointmentBtn}
      >
        <Text style={styles.appointmentText}>View My Appointments</Text>
      </TouchableOpacity>

      <FlatList
        data={providers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("ProviderDetails", { provider: item })
            }
          >
            <Text style={styles.name}>{item.name}</Text>
            <Image
            source={{ uri: item.image }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              marginBottom: 5,
              }}
/>
            <Text style={styles.category}>{item.category}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
  onPress={async () => {
    await saveData("currentUser", null);
    navigation.replace("Login");
  }}
  style={{ marginBottom: 10 }}
>
  <Text style={{ color: "red" }}>Logout</Text>
</TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  title: { fontSize: 22, marginBottom: 10 },

  appointmentBtn: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 6,
    alignItems: "center",
  },

  appointmentText: {
    color: "#fff",
    fontWeight: "bold",
  },

  card: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
  },

  category: {
    marginTop: 5,
    color: "gray",
  },
});