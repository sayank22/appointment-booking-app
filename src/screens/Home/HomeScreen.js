import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { providers } from "../../data/providers";
import { saveData } from "../../services/storage";

import { Colors } from "../../utils/Colors";

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}> 
      <View style={styles.container}>

{/* 🔥 View Appointments Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Appointments")}
          style={styles.appointmentBtn}
        >
          <Text style={styles.appointmentText}>My Appointments</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Service Providers</Text>

        <FlatList
          data={providers}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate("ProviderDetails", { provider: item })
              }
            >
              {/* Provider Image */}
              <Image
                source={{ uri: item.image }}
                style={styles.providerImage}
              />

              {/* Provider Text */}
              <View style={styles.cardTextContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.category}>{item.category}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
        
        <TouchableOpacity
          onPress={async () => {
            await saveData("currentUser", null);
            navigation.replace("Login");
          }}
          style={styles.logoutBtn}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    color: Colors.main,
    fontSize: 22,
    marginBottom: 10,
    fontWeight: "bold", 
  },
  appointmentBtn: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: Colors.primary,
    borderRadius: 6,
    alignItems: "center",
  },
  appointmentText: {
    color: Colors.textWhite,
    fontWeight: "bold",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors.cardWhite,
    marginBottom: 15,
    elevation: 3,
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  providerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  cardTextContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  category: {
    marginTop: 5,
    color: Colors.textSecondary,
  },
  logoutBtn: {
    marginTop: 10,
    marginBottom: 5,
    paddingVertical: 5,
    paddingHorizontal: 5,
    backgroundColor: Colors.cardTeal,
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    color: Colors.danger,
    fontSize: 16,
    fontWeight: "bold",
  },
});