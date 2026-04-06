import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getData, saveData } from "../../services/storage";
import { Colors } from "../../utils/Colors";
import { showImpact, showSuccess } from "../../utils/feedback";

export default function AppointmentListScreen() {
  const [appointments, setAppointments] = useState([]);

  const loadAppointments = async () => {
    // 1. Added [] and {} fallbacks to prevent crashes
    const allAppointments = await getData("appointments", []);
    const currentUser = await getData("currentUser", {});

    if (currentUser && currentUser.email) {
      const userAppointments = allAppointments.filter(
        (a) => a.userEmail === currentUser.email
      );
      setAppointments(userAppointments);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  // 2. Extracted the actual deletion logic
  const processCancel = async (id) => {
    const allAppointments = await getData("appointments", []);
    const updated = allAppointments.filter((a) => a.id !== id);
    await saveData("appointments", updated);
    loadAppointments(); // Refresh the list instantly
  };

  // 3. Added a confirmation prompt before deleting
  const handleCancel = (id) => {
          showImpact();
    if (Platform.OS === "web") {
      const confirmCancel = window.confirm("Are you sure you want to cancel this appointment?");
      if (confirmCancel) {
        processCancel(id);
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
};
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

                {/* Bottom Row: Time and Cancel Button */}
                <View style={styles.cardFooter}>
                  <View style={styles.timeBadge}>
                    <Text style={styles.slotText}>⏱ {item.slot}</Text>
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
  safeArea: { 
    flex: 1, 
    backgroundColor: Colors.background 
  },
  container: { 
    flex: 1, 
    padding: 20 
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20,
    color: Colors.textMain
  },
  
  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textMuted,
    fontStyle: "italic",
  },

  // Card Styles
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
  providerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textGroup: {
    flex: 1,
  },
  name: { 
    fontSize: 18, 
    fontWeight: "bold",
    color: Colors.textMain,
  },
  category: { 
    fontSize: 14, 
    color: Colors.textMuted,
    marginTop: 2,
  },

  // Footer Styles (Time & Button)
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: Colors.border, 
    paddingTop: 15,
  },
  timeBadge: {
    backgroundColor: Colors.primaryLight,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  slotText: { 
    fontWeight: "600",
    color: Colors.primary,
  },
  cancelBtn: {
    backgroundColor: Colors.cardWhite,
    borderWidth: 1,
    borderColor: Colors.danger,
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  cancelText: { 
    color: Colors.danger, 
    fontWeight: "bold" 
  },
});