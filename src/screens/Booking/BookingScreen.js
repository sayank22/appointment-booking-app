import { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { getData, saveData } from "../../services/storage";
import { Colors } from "../../utils/Colors";
import { showError, showSuccess, showWarning } from "../../utils/feedback";

export default function BookingScreen({ route, navigation }) {
  // 1. Catch the selectedSlot passed from the Details screen!
  const { provider, selectedSlot: initialSlot } = route.params;
  
  const [selectedSlot, setSelectedSlot] = useState(initialSlot || null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false );



  useEffect(() => {
    const fetchAppointments = async () => {
      const appointments = await getData("appointments", []);

      const providerBookings = appointments
        .filter((a) => a.providerName === provider.name)
        .map((a) => a.slot);

      setBookedSlots(providerBookings);
      
      // If the slot they clicked on the previous screen is actually booked, clear it
      if (providerBookings.includes(initialSlot)) {
        setSelectedSlot(null);
        return showError("Sorry, that slot was just booked by someone else!");
      }
    };

    fetchAppointments();
}, [initialSlot, provider.name]);

const handleBooking = async () => {
  try {
    if (!selectedSlot) {
      return showWarning("Please select a time slot");
    }

    setLoading(true);

    const currentUser = await getData("currentUser");
    if (!currentUser || !currentUser.email) {
      setLoading(false);
      return showError("Please login again");
    }

    const appointments = await getData("appointments", []);

    const isTaken = appointments.some(
      (a) => a.providerName === provider.name && a.slot === selectedSlot
    );

    if (isTaken) {
      setSelectedSlot(null);
      setLoading(false);
      return showError("Sorry, that slot was just booked by someone else!");
    }

    const newAppointment = {
      id: Date.now().toString(),
      userEmail: currentUser.email,
      providerName: provider.name,
      providerImage: provider.image,
      category: provider.category,
      slot: selectedSlot,
    };

    await saveData("appointments", [...appointments, newAppointment]);
    showSuccess("Appointment booked successfully!");
    navigation.navigate("My Appointments");
  } catch (error) {
    showError("An error occurred while booking. Please try again.");
  } finally {
    setLoading(false);
  }
};

return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Book {provider.name}</Text>
        <Text style={styles.subtitle}>Select an available time slot below:</Text>

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
                    isSelected && { color: Colors.textWhite }, 
                    isBooked && { color: Colors.textMuted },
                  ]}
                >
                  {isBooked ? "Booked" : slot}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Selected Slot Display */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryLabel}>Selected Time:</Text>
          <Text style={styles.selectedText}>
            {selectedSlot ? selectedSlot : "None Selected"}
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.button, !selectedSlot && styles.buttonDisabled]} 
          onPress={handleBooking}
          disabled={!selectedSlot} 
        >
          <Text style={styles.buttonText}>Confirm Booking</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 5, color: Colors.textMain },
  subtitle: { fontSize: 16, color: Colors.textSecondary, marginBottom: 20 },

  slotContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },

  slot: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
    minWidth: 100,
    alignItems: "center",
  },

  selectedSlot: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },

  bookedSlot: {
    backgroundColor: Colors.booked,
    borderColor: Colors.booked,
  },

  slotText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textMain,
  },

  summaryContainer: {
    backgroundColor: Colors.summaryBackground,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  summaryLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
  },

  selectedText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textMain,
  },

  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    elevation: 2,
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  
  buttonDisabled: {
    backgroundColor: Colors.buttonDisabled,
  },

  buttonText: {
    color: Colors.textWhite,
    fontWeight: "bold",
    fontSize: 18,
  },
});