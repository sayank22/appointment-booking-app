import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext"; // 👈 IMPORT YOUR AUTH
import { getData, saveData } from "../../services/storage";
import { Colors } from "../../utils/Colors";
import { showImpact, showSuccess } from "../../utils/feedback";

export default function AppointmentListScreen() {
  const [appointments, setAppointments] = useState([]);
  const { user } = useAuth(); // 👈 GET REAL USER DATA

  const loadAppointments = async () => {
    const allAppointments = await getData("appointments", []);

    // Use the real authenticated user's email
    if (user && user.email) {
      const userAppointments = allAppointments.filter(
        (a) => a.userEmail === user.email
      );
      // Sort appointments so the newest ones are at the top (optional but recommended)
      setAppointments(userAppointments.reverse());
    }
  };

  useEffect(() => {
    // We add user to the dependency array so it re-runs if they log in/out
    loadAppointments();
  }, [user]);

  const processCancel = async (id) => {
    const allAppointments = await getData("appointments", []);
    const updated = allAppointments.filter((a) => a.id !== id);
    await saveData("appointments", updated);
    loadAppointments(); 
  };

  const handleCancel = (id) => {
    showImpact();
    if (Platform.OS === "web") {
      const confirmCancel = window.confirm("Are you sure you want to cancel this appointment?");
      if (confirmCancel) {
        processCancel(id);
        showSuccess("Appointment removed");
      }
    } else {
      Alert.alert(
        "Cancel Appointment",
        "Are you sure you want to cancel this booking?",
        [
          { text: "No", style: "cancel" },
          { 
            text: "Yes, Cancel", 
            onPress: async () => {
              await processCancel(id);
              showSuccess("Appointment removed");
            }, 
            style: "destructive" 
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>My Appointments</Text>

        {appointments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You have no upcoming appointments.</Text>
          </View>
        ) : (
          <FlatList
            data={appointments}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.card}>
                
                {/* Top Row: Provider Info */}
                <View style={styles.providerInfo}>
                  {item.providerImage && (
                    <Image source={{ uri: item.providerImage }} style={styles.image} />
                  )}
                  <View style={styles.textGroup}>
                    <Text style={styles.name}>{item.providerName}</Text>
                    <Text style={styles.category}>{item.category}</Text>
                  </View>
                </View>

                {/* Bottom Row: Date/Time and Cancel Button */}
                <View style={styles.cardFooter}>
                  <View style={styles.timeBadge}>
                    {/* 👈 UPDATED THIS TO SHOW DATE AND TIME */}
                    <Text style={styles.slotText}>
                      📅 {new Date(item.date).toLocaleDateString()}
                    </Text>
                    <Text style={styles.slotText}>
                      ⏰ {item.time}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => handleCancel(item.id)}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>

              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: Colors.textMain },
  
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: Colors.textMuted, fontStyle: "italic" },

  card: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: Colors.cardWhite, 
    marginBottom: 15,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  providerInfo: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  image: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  textGroup: { flex: 1 },
  name: { fontSize: 18, fontWeight: "bold", color: Colors.textMain },
  category: { fontSize: 14, color: Colors.textMuted, marginTop: 2 },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // Changed to flex-end so the cancel button aligns with the bottom of the date/time
    borderTopWidth: 1,
    borderTopColor: Colors.border, 
    paddingTop: 15,
  },
  timeBadge: {
    backgroundColor: Colors.primaryLight || "#E6F0FF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  slotText: { 
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 2, // Adds a tiny gap between the calendar and clock text
  },
  cancelBtn: {
    backgroundColor: Colors.cardWhite,
    borderWidth: 1,
    borderColor: Colors.danger || "red",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  cancelText: { color: Colors.danger || "red", fontWeight: "bold" },
});