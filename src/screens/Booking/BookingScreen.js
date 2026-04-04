import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getData, saveData } from "../../services/storage";

export default function BookingScreen({ route, navigation }) {
  const { provider } = route.params;
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const appointments = await getData("appointments");

      const providerBookings = appointments
        .filter((a) => a.providerName === provider.name)
        .map((a) => a.slot);

      setBookedSlots(providerBookings);
    };

    fetchAppointments();
  }, []);

  const handleBooking = async () => {
    if (!selectedSlot) {
      if (Platform.OS === "web") {
  alert("Error", "Please select a time slot");
} else {
      Alert.alert("Error", "Please select a time slot");
}
      return;
    }

    const currentUser = await getData("currentUser");
    const appointments = await getData("appointments");

    const newAppointment = {
      id: Date.now().toString(),
      userEmail: currentUser.email,
      providerName: provider.name,
      slot: selectedSlot,
    };

    await saveData("appointments", [...appointments, newAppointment]);

    if (Platform.OS === "web") {
  alert("Success", "Appointment booked!");
} else {
    Alert.alert("Success", "Appointment booked!");
}
    navigation.navigate("Appointments");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Time Slot</Text>

      <View style={styles.slotContainer}>
        {provider.slots.map((slot) => {
          const isBooked = bookedSlots.includes(slot);
          const isSelected = selectedSlot === slot;

          return (
            <TouchableOpacity
              key={slot}
              style={[
                styles.slot,
                isSelected && styles.selectedSlot,
                isBooked && styles.bookedSlot,
              ]}
              onPress={() => !isBooked && setSelectedSlot(slot)}
              disabled={isBooked}
            >
              <Text
                style={[
                  styles.slotText,
                  isBooked && { color: "gray" },
                ]}
              >
                {slot}
              </Text>
              </TouchableOpacity>
          );
        })}
      </View>

      {/* ✅ Selected Slot Display */}
    <Text style={styles.selectedText}>
      Selected: {selectedSlot || "None"}
    </Text>

      <TouchableOpacity style={styles.button} onPress={handleBooking}>
        <Text style={styles.buttonText}>Confirm Booking</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, marginBottom: 15 },

  slotContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  slot: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    margin: 5,
  },

  selectedSlot: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },

  selectedText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "500",
  },

  bookedSlot: {
    backgroundColor: "#ddd",
  },

  slotText: {
    fontSize: 14,
  },

  button: {
    marginTop: 20,
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});