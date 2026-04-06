import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors } from "../../utils/Colors";

export default function ProviderDetailScreen({ route, navigation }) {
  const { provider } = route.params;

  // Navigate directly to Booking screen with the selected slot
  const handleBooking = (slot) => {
    navigation.navigate("Booking", { 
      provider: provider, 
      selectedSlot: slot 
    });
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
            {/* Price and Rating Badge */}
            <View style={styles.badgeContainer}>
              <Text style={styles.price}>{provider.price || "₹0"}</Text>
              <Text style={styles.rating}>⭐ {provider.rating || "N/A"}</Text>
            </View>
          </View>
          
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            {provider.about || "No description available for this provider."}
          </Text>

          <Text style={styles.sectionTitle}>Available Slots</Text>
          <View style={styles.slotsContainer}>
            {provider.slots && provider.slots.length > 0 ? (
              provider.slots.map((slot, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.slotButton}
                  onPress={() => handleBooking(slot)}
                >
                  <Text style={styles.slotText}>{slot}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noSlotsText}>No slots available today.</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.textMain,
  },
  category: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginBottom: 20,
    marginTop: 4,
  },
  badgeContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  rating: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: Colors.textMain,
  },
  aboutText: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  slotButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
    elevation: 2, 
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  slotText: {
    color: Colors.textMain,
    fontWeight: 'bold',
    fontSize: 15,
  },
  noSlotsText: {
    color: Colors.textSecondary,
    fontStyle: 'italic',
  }
});