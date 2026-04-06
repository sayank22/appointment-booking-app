import { createNativeStackNavigator } from "@react-navigation/native-stack";


import AnimatedHeader from "../components/AnimatedHeader";
import AppointmentListScreen from "../screens/Appointments/AppointmentListScreen";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import BookingScreen from "../screens/Booking/BookingScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import ProviderDetailScreen from "../screens/Provider/ProviderDetailScreen";

import { Colors } from "../utils/Colors";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitle: () => <AnimatedHeader title="BookIt" />,
        Colors: Colors.main,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: Colors.cardTeal,
        },
        headerShadowVisible: false,
        headerTintColor: Colors.primary, 
      }}
    >
      {/* Auth Screens: Hide the header so they look like full-screen splash/login pages */}
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{ headerShown: false }} 
      />

      {/* Main App Screens: These will automatically use the AnimatedHeader */}
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ProviderDetails" component={ProviderDetailScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="Appointments" component={AppointmentListScreen} />
    </Stack.Navigator>
  );
}