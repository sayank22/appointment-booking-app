import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";

import AnimatedHeader from "../components/AnimatedHeader";
import AppointmentListScreen from "../screens/Appointments/AppointmentListScreen";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import BookingScreen from "../screens/Booking/BookingScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import ProviderDetailScreen from "../screens/Provider/ProviderDetailScreen";

import { Colors } from "../utils/Colors";

const Stack = createNativeStackNavigator();


// AUTH STACK (Login/Register)
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}


// APP STACK (Protected Screens)
function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitle: () => <AnimatedHeader title="BookIt" />,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: Colors.cardTeal,
        },
        headerShadowVisible: false,
        headerTintColor: Colors.primary,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ProviderDetails" component={ProviderDetailScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="Appointments" component={AppointmentListScreen} />
    </Stack.Navigator>
  );
}


// MAIN NAVIGATOR (Switch based on auth)
export default function AppNavigator() {
  const { user, loading } = useAuth();

  console.log("AppNavigator render", { user: !!user, loading });

  // Loading state (auto-login check)
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return user ? <AppStack /> : <AuthStack />;
}
