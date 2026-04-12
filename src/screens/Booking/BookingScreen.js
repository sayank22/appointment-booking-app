import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { getData, saveData } from "../../services/storage";
import { Colors } from "../../utils/Colors";
import { showError, showSuccess } from "../../utils/feedback";

const webInputStyle = {
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #DDD',
  fontSize: '16px',
  fontFamily: 'inherit',
  width: '100%',
  marginBottom: '15px',
  backgroundColor: 'white',
  cursor: 'pointer'
};

export default function BookingScreen({ route, navigation }) {
  const { provider } = route.params;
  const { user } = useAuth();

  // --- NEW STATE MANAGEMENT ---
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [mode, setMode] = useState("date"); // 'date' or 'time'
  const [showPicker, setShowPicker] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [bookedTimes, setBookedTimes] = useState([]); 

  // Formatters for the UI and Database
  const formattedDate = date.toISOString().split("T")[0]; // "2026-04-08"
  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // "10:30 AM"

  useEffect(() => {
    const fetchAppointments = async () => {
      const appointments = await getData("appointments", []);
      const providerBookingsForDate = appointments
        .filter((a) => a.providerName === provider.name && a.date === formattedDate)
        .map((a) => a.time);

      setBookedTimes(providerBookingsForDate);
    };

    fetchAppointments();
  }, [formattedDate, provider.name]);

  // --- NATIVE PICKER LOGIC ---
  const onChange = (event, selectedValue) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    
    if (selectedValue) {
      if (mode === "date") {
        setDate(selectedValue);
      } else {
        setTime(selectedValue);
      }
    }
  };

  const showMode = (currentMode) => {
    setShowPicker(true);
    setMode(currentMode);
  };

  const handleBooking = async () => {
    try {
      if (!user) return showError("Session expired. Please login again.");
      setLoading(true);

      const appointments = await getData("appointments", []);

      const isTaken = appointments.some(
        (a) => a.providerName === provider.name && a.date === formattedDate && a.time === formattedTime
      );

      if (isTaken) {
        setLoading(false);
        return showError("Sorry, that exact time is already booked!");
      }

      const newAppointment = {
        id: Date.now().toString(),
        userEmail: user.email,
        providerName: provider.name,
        providerImage: provider.image,
        category: provider.category,
        date: formattedDate, 
        time: formattedTime, 
      };

      await saveData("appointments", [...appointments, newAppointment]);
      showSuccess("Appointment booked successfully!");
      navigation.navigate("Appointments"); 
    } catch {
      showError("An error occurred while booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Book {provider.name}</Text>
        <Text style={styles.subtitle}>Choose your preferred date and time</Text>

        <View style={styles.pickerContainer}>
          {/* --- DATE SELECTION --- */}
          <Text style={styles.sectionLabel}>Select Date</Text>
          {Platform.OS === 'web' ? (
            <input
              type="date"
              value={formattedDate}
              onChange={(e) => {
                const selected = new Date(e.target.value);
                const offset = selected.getTimezoneOffset() * 60000;
                setDate(new Date(selected.getTime() + offset));
              }}
              style={webInputStyle}
            />
          ) : (
            <TouchableOpacity style={styles.pickerButton} onPress={() => showMode("date")}>
              <Text style={styles.pickerButtonText}>📅 {date.toDateString()}</Text>
            </TouchableOpacity>
          )}

          {/* --- TIME SELECTION --- */}
          <Text style={styles.sectionLabel}>Select Time</Text>
          {Platform.OS === 'web' ? (
            <input
              type="time"
              value={time.toTimeString().slice(0, 5)}
              onChange={(e) => {
                const [hours, minutes] = e.target.value.split(':');
                const newTime = new Date();
                newTime.setHours(parseInt(hours), parseInt(minutes));
                setTime(newTime);
              }}
              style={webInputStyle}
            />
          ) : (
            <TouchableOpacity style={styles.pickerButton} onPress={() => showMode("time")}>
              <Text style={styles.pickerButtonText}>⏰ {formattedTime}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* NATIVE PICKER MODAL (Mobile Only) */}
        {Platform.OS !== 'web' && showPicker && (
          <DateTimePicker
            value={mode === "date" ? date : time}
            mode={mode}
            is24Hour={false}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            minimumDate={new Date()}
            onChange={onChange}
          />
        )}

        {/* iOS ONLY: Close button for spinner */}
        {Platform.OS === "ios" && showPicker && (
           <TouchableOpacity style={{marginBottom: 20, alignItems: "center"}} onPress={() => setShowPicker(false)}>
             <Text style={{color: Colors.primary, fontWeight: "bold", fontSize: 16}}>Done</Text>
           </TouchableOpacity>
        )}

        {/* --- SUMMARY --- */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryLabel}>Selected Appointment:</Text>
          <Text style={styles.selectedText}>
             {date.toDateString()} at {formattedTime}
          </Text>
          
          {bookedTimes.includes(formattedTime) && (
            <Text style={{color: Colors.error || "red", marginTop: 5, fontWeight: "bold"}}>
               ⚠️ This exact time is already booked.
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleBooking}
          disabled={loading || bookedTimes.includes(formattedTime)}
        >
          <Text style={styles.buttonText}>
            {loading ? "Booking..." : "Confirm Booking"}
          </Text>
        </TouchableOpacity>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flexGrow: 1, padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 5, color: Colors.textMain },
  subtitle: { fontSize: 16, color: Colors.textSecondary, marginBottom: 20 },
  
  pickerContainer: { marginBottom: 20 },
  sectionLabel: { fontSize: 16, fontWeight: "bold", color: Colors.textMain, marginBottom: 8, marginTop: 10 },
  
  pickerButton: {
    backgroundColor: Colors.cardWhite || "#FFF",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border || "#DDD",
    marginBottom: 10,
  },
  pickerButtonText: {
    fontSize: 18,
    color: Colors.textMain,
    fontWeight: "600",
  },

  summaryContainer: {
    backgroundColor: Colors.summaryBackground || "#F8F9FA",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  summaryLabel: { fontSize: 14, color: Colors.textSecondary, marginBottom: 5 },
  selectedText: { fontSize: 16, fontWeight: "bold", color: Colors.textMain },
  
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: { backgroundColor: Colors.buttonDisabled || "#CCC" },
  buttonText: { color: Colors.textWhite, fontWeight: "bold", fontSize: 18 },
});