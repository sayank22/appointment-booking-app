import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AppointmentListScreen from "../screens/Appointments/AppointmentListScreen";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import BookingScreen from "../screens/Booking/BookingScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import ProviderDetailScreen from "../screens/Provider/ProviderDetailScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ProviderDetails" component={ProviderDetailScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="Appointments" component={AppointmentListScreen} />
    </Stack.Navigator>
  );
}