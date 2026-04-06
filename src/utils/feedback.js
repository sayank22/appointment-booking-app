import { Alert, Platform, ToastAndroid } from "react-native";
import { triggerHaptic } from "./haptics";

function showMessage(message, duration = ToastAndroid.SHORT) {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, duration);
    return;
  }

  Alert.alert("Notice", message);
}

export function showSuccess(message, duration = ToastAndroid.SHORT) {
  triggerHaptic("success");
  showMessage(message, duration);
}

export function showWarning(message, duration = ToastAndroid.SHORT) {
  triggerHaptic("warning");
  showMessage(message, duration);
}

export function showError(message, duration = ToastAndroid.SHORT) {
  triggerHaptic("error");
  showMessage(message, duration);
}
