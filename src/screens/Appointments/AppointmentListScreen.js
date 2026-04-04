import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getData, saveData } from "../../services/storage";

export default function AppointmentListScreen() {
  const [appointments, setAppointments] = useState([]);

  const loadAppointments = async () => {
    const allAppointments = await getData("appointments");
    const currentUser = await getData("currentUser");

    const userAppointments = allAppointments.filter(
      (a) => a.userEmail === currentUser.email
    );

    setAppointments(userAppointments);
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleCancel = async (id) => {
    const allAppointments = await getData("appointments");

    const updated = allAppointments.filter((a) => a.id !== id);

    await saveData("appointments", updated);

    if (Platform.OS === "web") {
  alert("Cancelled", "Appointment removed");
} else {
    Alert.alert("Cancelled", "Appointment removed");
}
    loadAppointments();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Appointments</Text>

      {appointments.length === 0 ? (
        <Text>No appointments yet</Text>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.providerName}</Text>
              <Text style={styles.slot}>{item.slot}</Text>

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => handleCancel(item.id)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, marginBottom: 10 },

  card: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    marginBottom: 10,
  },

  name: { fontSize: 16, fontWeight: "bold" },
  slot: { marginTop: 5 },

  cancelBtn: {
    marginTop: 10,
    backgroundColor: "red",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
  },

  cancelText: { color: "#fff" },
});