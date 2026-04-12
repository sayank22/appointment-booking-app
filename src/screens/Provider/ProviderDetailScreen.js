import { useNavigation } from '@react-navigation/native';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../utils/Colors";

export default function ProviderDetailScreen({ route }) {
  const navigation = useNavigation();
  const { provider } = route.params;

  // Just navigate to the Booking screen and pass the provider
  const handleBookingClick = () => {
    navigation.navigate("Booking", { provider: provider });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Provider Header Image */}
        <Image source={{ uri: provider.image }} style={styles.image} />

        <View style={styles.infoContainer}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.name}>{provider.name}</Text>
              <Text style={styles.category}>{provider.category}</Text>
            </View>
            <View style={styles.badgeContainer}>
              <Text style={styles.price}>{provider.price || "₹0"}</Text>
              <Text style={styles.rating}>⭐ {provider.rating || "N/A"}</Text>
            </View>
          </View>
          
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            {provider.about || "No description available for this provider."}
          </Text>
        </View>
      </ScrollView>

      {/* Sticky Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookingClick}>
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  image: { width: '100%', height: 250, resizeMode: 'cover' },
  infoContainer: { padding: 20, paddingBottom: 100 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  name: { fontSize: 26, fontWeight: 'bold', color: Colors.textMain },
  category: { fontSize: 18, color: Colors.textSecondary, marginBottom: 20, marginTop: 4 },
  badgeContainer: { alignItems: 'flex-end' },
  price: { fontSize: 20, fontWeight: 'bold', color: Colors.primary },
  rating: { fontSize: 16, color: Colors.textSecondary, marginTop: 4 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 10, color: Colors.textMain },
  aboutText: { fontSize: 16, color: Colors.textSecondary, lineHeight: 24 },
  footer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: 20,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border || "#E0E0E0",
  },
  bookButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  bookButtonText: { color: Colors.textWhite, fontWeight: 'bold', fontSize: 18 },
});