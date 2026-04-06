import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../utils/Colors';

export default function ProviderCard({ provider, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: provider.image }} style={styles.providerImage} />
      <View style={styles.cardTextContainer}>
        <Text style={styles.name}>{provider.name}</Text>
        <Text style={styles.category}>{provider.category}</Text>
        <Text style={styles.ratingText}>⭐ {provider.rating || "N/A"}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    backgroundColor: Colors.cardWhite,
    marginBottom: 15,
    elevation: 3,
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  providerImage: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    marginRight: 15,
  },
  cardTextContainer: { flex: 1 },
  name: { fontSize: 18, fontWeight: "bold", color: Colors.textMain },
  category: { marginTop: 2, color: Colors.textMuted },
  ratingText: { marginTop: 4, fontSize: 12, color: Colors.textMuted },
});