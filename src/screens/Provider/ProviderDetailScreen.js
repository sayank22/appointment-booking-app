import { Button, StyleSheet, Text, View } from "react-native";

export default function ProviderDetailScreen({ route, navigation }) {
  const { provider } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{provider.name}</Text>
      <Text>{provider.category}</Text>

      <Button
        title="Book Appointment"
        onPress={() =>
          navigation.navigate("Booking", { provider: provider })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, marginBottom: 10 },
});